# Webhooks

Webhooks são integrações [configuradas na sua conta] que escutarão a certos eventos das chamadas. Quando um evento ocorrer, enviaremos uma requisição HTTP POST (notificação) para a URL configurada no webhook.

Um **evento** é um *ação* que acontece com um determinado **recurso**. Por exemplo, um evento ocorre quando uma ***chamada*** é ***atendida***.

Dependendo da necessidade da sua integração, os webhooks podem ser úteis para atualizar um sistema de tickets externo, gerar um relatório no seu sistema ou executar tarefas diversas.


\* *Webhooks também são conhecidos como* ***Callbacks*** *ou* ***Reverse API***.

## Requisição

<blockquote>
  <strong>Exemplo de requisição:</strong>
</blockquote>

```
POST /1d4c5sf1 HTTP/1.1

Host: requestb.in
User-Agent: App-Robot (staging)
Content-Type: application/json
X-Hub-Signature: sha1=5780ee6915fcc2d2e6a847d9c9e48f9ebe0159e7
X-App-Event: ping
X-App-Request-Id: c11366b2-813e-499c-a673-cbf03c17eed5
X-App-Environment: staging

{
  "event_code": "ping",
  "call": {
    "call_id": 1003
  },
  "webhook": {
    "id": 1,
    "url": "http://requestb.in/1d4c5sf1"
  }
}
```

As requisições realizadas para as URLs configuradas nos webhooks contém os seguintes cabeçalhos:

    Cabeçalho               |        Descrição
----------------------------|-----------------------------------------------
X-App-Event       | [Código do evento](#eventos) que gerou a requisição.
X-App-Request-Id  | Código identificador da requisição, no formato [UUID][uuid].
X-App-Environment | Ambiente de onde a requisição foi disparada (`production` ou `staging`).
X-Hub-Signature             | Assinatura de segurança, para a sua aplicação verificar a autenticidade da requisição. O valor desse header é computado com o HMAC hex digest do corpo da requisição, usando o algoritmo sha1 com a chave secreta do webhook (disponível na página do webhook) como chave de criptografia (ver exemplo ao lado).
User-Agent                  | `App-Robot` + o ambiente que originou a requisição.
Content-Type                | Formato do [payload](#payloads), de acordo com o que for configurado no webhook. Os formatos disponíveis são `application/json` e `application/x-www-form-urlencoded`.

> Exemplo de como gerar o X-Hub-Signature:

```ruby
# Chave secreta do webhook
key = '31f439e8b93520776732ad97e129700d9d1020ed'

# Corpo da requisição
body = '{"event_code":"call.finished","call":{"call_id":"123123"}}'

digest = OpenSSL::Digest.new('sha1')
OpenSSL::HMAC.hexdigest(digest, key, body)
=> 'c7fb37d21fc3a868e346eca1d89af5ce15f83317'
```

```sh
# Chave secreta do webhook
$ key='31f439e8b93520776732ad97e129700d9d1020ed'

# Corpo da requisição
$ body='{"event_code":"call.finished","call":{"call_id":"123123"}}'

$ echo -n $body | openssl dgst -sha1 -hmac $key
c7fb37d21fc3a868e346eca1d89af5ce15f83317
```

## Eventos

Todo evento possui um código que identifica o seu tipo. Esses códigos são formatados no padrão `resource.event`, sendo `resource` o nome do recurso e `event` o nome do evento disparado. Na tabela abaixo estão listados todos os tipos de eventos:

       Código        |        Descrição
---------------------|-----------------------------------------------
call.newcall         | Quando uma chamada nova é iniciada.
call.a_leg_answered  | Quando uma chamada é atendida pela ponta A. Somente quando a `direction` for `outbound`
call.b_leg_answered  | Quando uma chamada é atendida pela ponta B.
call.finished        | Quando uma chamada é finalizada.
call.audio_available | Quando o áudio de uma chamada fica disponível para dar play.
call.call_tag        | Quando uma chamada é classificada pela ponta B.
call.interaction     | Quando quem ligou digita um número válido em alguma interação.
call.word_spotting   | Quando uma chamada tiver termos em monitoramento identificados.

Ao configurar um webhook, você seleciona quais desses eventos ele escutará. Marcar somente os eventos específicos que você precisa tratar pode ajudar a limitar a quantidade de requisições HTTP que a sua aplicação receberá. Somente os eventos selecionados farão com que o webhook dispare requisições.

**Nota:** Independentemente de existir webhooks configurados ou não,registramos todos os eventos internamente (com exceção do [ping](#evento-ping)) e os disponibiliza no [Log de eventos][log_eventos] por um tempo limitado.


### Evento Ping

O evento ping é um evento especial disparado para testar se a URL do webhook está funcionando. Quando um webhook é criado, é necessário fazer a ativação do mesmo através do botão "Enviar ping", que dispara um evento ping.

Esse evento não é registrado no log de eventos.

### Eventos Coringa (Wildcard)

Eventos coringa (wildcard) não são eventos que acontecem, são apenas representações de um conjunto de eventos que um webhook pode escutar. Os eventos coringa disponíveis são:

       Código        |        Descrição
---------------------|-----------------------------------------------
\*                   | Todos os eventos, inclusive os que ainda surgirão.
call.*               | Todos os eventos do recurso `call` (chamada), inclusive os que ainda surgirão.

## Payloads

<blockquote>
  <strong>Exemplos de payloads:</strong>
</blockquote>

> Payload do evento ***ping***:

```json
{
  "event_code": "ping",
  "call": {
    "call_id": "1003"
  },
  "webhook": {
    "id": 1,
    "url": "http://seu-site.com/15a0nqn1"
  }
}
```

> Payload dos eventos ***call.\****:

```json
{
  "event_code": "call.finished",
  "webhook": {
    "id": 453,
    "url": "http://seu-site.com/15a0nqn1"
  },
  "call": {
    "call_id": "1003",
    "from_number": "552122334466",
    "ani_prefix":"21",
    "ani_city":"Rio de Janeiro",
    "ani_state":"Rio de Janeiro",
    "ani_uf":"RJ",
    "ani_kind":"cellphone",
    "ani_provider":"Claro",
    "ani_lat":"9999",
    "ani_long":"8888",
    "call_terminated":"A",
    "dnis": "5",
    "alt_dnis": "6",
    "number_name": "Number 1",
    "number_host": "Number host",
    "number_info1": "Number info 1",
    "number_info2": "Number info 2",
    "number_info3": "Number info 3",
    "started_at": "2015-01-01T01:11:00.000-02:00",
    "status": "answered",
    "status_details": "conference",
    "block_reason":"blocked_by_user_configuration",
    "my_status_code":"1",
    "my_status_name":"My Status Name",
    "my_status_complement_1":"My Status Complement 1",
    "my_status_complement_2":"My Status Complement 2",
    "my_status_info_1":"My Status Info 1",
    "my_status_info_2":"My Status Info 2",
    "my_status_info_3":"My Status Info 3",
    "my_kpi":["tag1","tag2"],
    "result_leg_a":"error",
    "result_leg_b":"error",
    "leg_a_type":"client",
    "attendant_name":"Attendant Name",
    "attendant_email":"foo@bar.com",
    "attendant_number":"552122333333",
    "attendant_extension_number":"30",
    "business_hours": "worktime",
    "business_hours_complement":"Holiday Name",
    "billed_duration": 60,
    "inbound_duration": 75,
    "ura_duration": 50,
    "dial_duration": 10,
    "ring_duration_a": 10,
    "ring_duration_b": 5,
    "ring_duration_c": 15,
    "direction": "inbound",
    "kind":"default",
    "customer_info": "your_info",
    "selected_options": [
      "1",
      "3",
      "2"
    ],
    "call_tags": [
      {
        "code": "70",
        "description": "Lead"
      },
      {
        "code": " 71",
        "description": "Follow up"
      }
    ],
    "audio_url": "https://app.atendimento.algardigital.com.br/public/audios/98b2ec022a7f051a84e65b",
    "zendesk_ticket_id": "673",
    "outbound_calls": [
      {
        "started_at": "2015-01-01T01:11:00.000-02:00",
        "phone_number": "5521988221122",
        "name": "Jane Doe",
        "email": "jane@as.com",
        "extension": 22,
        "duration": 17,
        "billed_duration": 11,
        "option": 3,
        "group": 3
      },
      {
        "started_at": "2015-01-01T01:15:00.000-02:00",
        "phone_number": "5521988221010",
        "name": "André",
        "email": "andre@exemplo.com.br",
        "extension": 23,
        "duration": 34,
        "billed_duration": 30
      },
      {
        "started_at": "2015-01-01T01:19:00.000-02:00",
        "phone_number": "552130992121",
        "name": "Joyce",
        "email": "joyce@exemplo.com.br",
        "extension": 26,
        "duration": 24,
        "billed_duration": 19,
        "amount": "4.75"
      }
    ],
    "interactions": [
      {
        "digits": "30743211233",
        "selected_option": "2",
        "validation_status": "ok"
      },
      {
        "digits": "34",
        "selected_option": "1",
        "validation_status": "error"
      }
    ],
    "post_attendances": [
      {
        "digits":"8",
        "status": "1",
        "name": "Post Attendance 9",
        "selected_option": "9"
      }
    ],
    "word_spottings": [
      {
        "word": "procon",
        "word_group": "reclamação",
        "score": 45,
        "occurred_at": "1900-01-01T00:01:48.159+00:00"
      }
    ]
  }
}
```


As requisições enviadas pelos webhooks possuem um conjunto de informações chamado de **payload**, que contém dados do recurso (do momento que o evento ocorre) e dados do próprio evento. Essas informações são estruturadas nos seguintes campos:

           |                          |
-----------|--------------------------|
event_code | [Código do evento](#eventos) que originou a requisição, seguindo o padrão `resource.event`.
webhook    | Dados do webhook que disparou a requisição.
call       | Dados da chamada.
changes    | Mudanças realizadas no recurso (presente somente quando `event` for `updated`).

Veja exemplos de payloads para todos os tipos de evento na coluna ao lado.

### Call

    Campo              |  Tipo   |  Descrição
-----------------------|---------|-----------------------------------------------
call_id                | String  | Código identificador da chamada.
from_number            | String  | Número do telefone de quem ligou para o seu atendimento (ponta A), no formato `código do país` + `DDD` + `telefone`. Exemplo: `"552130409670"`.
ani_prefix             | String  | DDD do telefone de quem ligou
ani_city               | String  | Cidade do telefone de quem ligou
ani_state              | String  | Nome do estado do telefone de quem ligou
ani_uf                 | String  | Siglas do estado do telefone de quem ligou, exemplo: "SP"
ani_kind               | String  | Tipo do telefone de quem ligou (`"cellphone"`, `"linephone"` ou `"unknown"`)
ani_provider           | String  | Operadora do telefone de quem ligou
ani_lat                | String  | Latitude do telefone de quem ligou
ani_long               | String  | Longitude do telefone de quem ligou
call_terminated        | String  | Perna que desligou a chamada ("Plataforma", "A" ou "B")
dnis                   | String  | Número do seu atendimento, no formato `código do país` + `número`. Exemplo: `"5508008871898"`.
alt_dnis               | String  | Número para o qual foi realizada a chamada originalmente e redirecionada para o dnis, no formato `código do país` + `número`. Exemplo: `"5508008871898"`.
number_name            | String  | Nome definido para o número que a chamada foi realizada, os nomes para cada número podem ser configurados clicando em "Opções de conta" e depois no menu "Números"            
number_host            | String  | Host definido para o número que a chamada foi realizada, os hosts para cada número podem ser configurados clicando em "Opções de conta" e depois no menu "Números"
number_info1           | String  | Valor definido para o número que a chamada foi realizada, os valores para cada número podem ser configurados clicando em "Opções de conta" e depois no menu "Números", no campo "Info 1"
number_info2           | String  | Valor definido para o número que a chamada foi realizada, os valores para cada número podem ser configurados clicando em "Opções de conta" e depois no menu "Números", no campo "Info 2"
number_info3           | String  | Valor definido para o número que a chamada foi realizada, os valores para cada número podem ser configurados clicando em "Opções de conta" e depois no menu "Números", no campo "Info 3"
direction              | String  | Direção da chamada: `inbound` ou `outbound`. Ex.: quando alguém ligar para o seu atendimento será `inbound` ou quando for uma chamada de alguns dos discadores será `outbound`
started_at             | DateTime| Data e hora do início da chamada, no formato [ISO8601][iso8601], com fuso horário -0300 (referente ao do Brasil, GMT-3). Exemplo: `"2015-05-07T16:26:05.000-03:00"`.
status                 | String  | Status da chamada no momento do evento. Os status possíveis são: `newcall`, `in_progress`, `abandoned`, `answered`, `blocked`, `handled` e `missed`.
status_details         | String  | Complemento do status. Pode vir com o nome do atendente que atendeu a ligação, uma mensagem personalizada ou com a mensagem `"Desligada"`.
block_reason           | String  | Motivo da chamada ter sido bloqueada
my_status_code         | String  | Código do Meu Status aplicado na chamada
my_status_name         | String  | Nome do Meu Status aplicado na chamada
my_status_complement_1 | String  | Complemento 1 do Meu Status aplicado na chamada
my_status_complement_2 | String  | Complemento 2 do Meu Status aplicado na chamada
my_status_info_1       | String  | Info 1 do Meu Status aplicado na chamada
my_status_info_2       | String  | Info 2 do Meu Status aplicado na chamada
my_status_info_3       | String  | Info 3 do Meu Status aplicado na chamada
my_kpi                 | Array  | Nomes das tags aplicadas na chamada
result_leg_a           | String  | Resultado da perna A (`"answered"`, `"error"`, `"others"`, `"busy_or_unavailable"`, `"answered_machine"`, `"not_answered"` ou `"absent"`)
result_leg_b           | String  | Resultado da perna B (`"answered"`, `"error"`, `"others"`, `"busy_or_unavailable"`, `"canceled"`, `"answered_machine"`, `"not_answered"` ou `"absent"`)
leg_a_type             | String  | Tipo de perna A (`"attendant"` ou `"client"`)
attendant_name         | String  | Nome do Atendente que atendeu a ligação
attendant_email        | String  | Email do Atendente que atendeu a ligação
attendant_number       | String  | Telefone do Atendente que atendeu a ligação
attendant_extension_number | String  | Ramal do Atendente que atendeu a ligação
voicemail              | Boolean  | Se tem caixa postal
voicemail              | Boolean  | Se tem caixa postal
business_hours         | String  | Identifica se a chamada ocorreu dentro ou fora do horário de atendimento configurado. Os valores possíveis são: `worktime` e `out_of_worktime`.
business_hours_complement | String  | Complemento do horário, pode vir com o nome do feriado em que a chamada foi efetuada 
inbound_duration       | Integer | Duração real da chamada (em segundos), sem arredondamento.
ura_duration           | Integer | Duração na ura (em segundos), sem arredondamento.
dial_duration          | Integer | Tempo de espera na fila (em segundos), sem arredondamento.
ring_duration_a        | Integer | Tempo que levou a pessoa atender a ligação da perna A (em segundos), sem arredondamento
ring_duration_b        | Integer | Tempo que levou a pessoa atender a ligação da perna B (em segundos), sem arredondamento
ring_duration_c        | Integer | Tempo que levou a pessoa atender a ligação da perna C (em segundos), sem arredondamento
selected_options       | Array   | Opções do menu digitadas por quem ligou, na ordem em que forem digitadas. Se o atendimento for automático, ou seja, sem menu de opções, o valor retornado será sempre `"1"`. Dependendo da configuração do atendimento, é possível digitar mais de uma opção. Exemplo: `["1", "3"]`.
kind                   | String  | Tipo da configuração usada na ligação
call_tags              | Array   | Classificações da chamada registradas por quem atendeu a ligação. Exemplo: `[{"code": "70", "description": "Lead"}]`.
call_tags &#65515; code       | String  | Código que o atendente digitou para efetuar a classificação.
call_tags &#65515; description| String  | Descrição referente ao código digitado na classificação.
audio_url              | String  | Link para o arquivo com a gravação da conversa ou áudio da caixa postal. Exemplo: `"https://app.atendimento.algardigital.com.br/public/audios/98b2ec022a7f051a84e65b"`.
zendesk_ticket_id      | String  | Código identificador do ticket do Zendesk associado à chamada.
customer_info      | String  | Informação por chamada enviada por sua API na requisição de uma chamada sainte, na resposta de uma pré-chamada ou na resposta de uma interação. Caso não tenha sido enviada essa informação, o campo ficará em branco. Se durante uma chamada forem enviados diferentes customer_info, ficará sempre armazenado a última string.
outbound_calls         | Array   | Informações referente aos reencaminhamentos da chamada (pode haver mais de um). Só serão apresentados os reencaminhamentos que forem atendidos.
outbound_calls &#65515; started_at   | DateTime | Data e hora do reencaminhamento, no formato [ISO8601][iso8601], com fuso horário -0300 (referente ao do Brasil, GMT-3). Exemplo: `"2015-05-07T17:26:05.000-03:00"`.
outbound_calls &#65515; phone_number | String   | Número do telefone que atendeu o reencaminhamento. Exemplo: `"5511999999999"`.
outbound_calls &#65515; name         | String   | Nome do atendente que atendeu o reencaminhamento. Exemplo: `"João"`.
outbound_calls &#65515; email        | String  | E-mail do atendente que atendeu o reencaminhamento. Exemplo: `joao@suaempresa.com`.
outbound_calls &#65515; extension    | Integer  | Ramal do atendente que atendeu o reencaminhamento. Exemplo: `22`.
outbound_calls &#65515; duration     | Integer  | Duração real do reencaminhamento (em segundos).
outbound_calls &#65515; option       | Integer    | opção em que a chamada foi atendida pelo Atendente. Exemple: `6`.
outbound_calls &#65515; queue_id     | Integer  | Código interno da fila de atendimento que atendeu a chamada, sendo: de `0` a `9` opções diretas do menu, de `21` a `99` ramais, `1000` fora de horário e outros números de opções complementares.
interactions         | Array   | Informações referente às interações da chamada.
interactions &#65515; digits       | Integer    | Número digitado na interação por quem ligou para seu atendimento.
interactions &#65515; selected_option | Integer | Opção de interação do menu digitada por quem ligou.
interactions &#65515; validation_status | String | Status de validação da interação. Valores possíveis: `"ok"` ou `"error"`.
post_attendances     | Array   | Informações sobre as pesquisas de pós atendimento
word_spottings       | Array   | Informações referente ao monitoramento de termos.
word\_spottings &#65515; word         | String  | Termo identificado durante a chamada. Exemplo: `"procon"`.
word\_spottings &#65515; word_group   | String  | Grupo ao qual o termo pertence. Exemplo: `"reclamação"`.
word\_spottings &#65515; score        | Integer | Porcentagem de certeza de que o termo identificado na chamada é realmente o que foi configurado. Exemplo: 85.
word\_spottings &#65515; occurred_at  | Time    | Tempo da chamada em que o termo foi identificado. Sendo uma representação de tempo, a data virá sempre "zerada", e deverá ser desconsiderada. Exemplo: `"1900-01-01T00:01:48.159+00:00"` se refere ao tempo `1m, 48s e 159ms` da chamada.

[uuid]: https://en.wikipedia.org/wiki/Universally_unique_identifier
[log_eventos]: http://app.atendimento.algardigital.com.br/webhook/event_logs
[iso8601]: https://en.wikipedia.org/wiki/ISO_8601