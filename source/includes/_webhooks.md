# Webhooks

Webhooks são integrações [configuradas na sua conta](http://app.atendesimples.com/webhooks) que escutarão a certos eventos do Atende Simples. Quando um evento ocorrer, o Atende Simples enviará uma requisição HTTP POST (notificação) para a URL configurada no webhook.

Um **evento** é um *ação* que acontece com um determinado **recurso** do Atende Simples. Por exemplo, um evento ocorre quando uma ***chamada*** é ***atendida***.

Dependendo da necessidade da sua integração, os webhooks podem ser úteis para atualizar um sistema de tickets externo, gerar um relatório no seu sistema ou executar tarefas diversas.


\* *Webhooks também são conhecidos como* ***Callbacks*** *ou* ***Reverse API***.

## Requisição

<blockquote>
  <strong>Exemplo de requisição:</strong>
</blockquote>

```
POST /1d4c5sf1 HTTP/1.1

Host: requestb.in
User-Agent: AtendeSimples-Robot (staging)
Content-Type: application/json
X-Hub-Signature: sha1=5780ee6915fcc2d2e6a847d9c9e48f9ebe0159e7
X-AtendeSimples-Event: ping
X-AtendeSimples-Request-Id: c11366b2-813e-499c-a673-cbf03c17eed5
X-AtendeSimples-Environment: staging

{
  "event_code": "ping",
  "webhook": {
    "id": 1,
    "url": "http://requestb.in/1d4c5sf1"
  }
}
```

As requisições realizadas para as URLs configuradas nos webhooks contém os seguintes cabeçalhos:

    Cabeçalho               |        Descrição
----------------------------|-----------------------------------------------
X-AtendeSimples-Event       | [Código do evento](#eventos) que gerou a requisição.
X-AtendeSimples-Request-Id  | Código identificador da requisição, no formato [UUID][uuid].
X-AtendeSimples-Environment | Ambiente de onde a requisição foi disparada (`production` ou `staging`).
X-Hub-Signature             | Assinatura de segurança, para a sua aplicação verificar a autenticidade da requisição. O valor desse header é computado com o HMAC hex digest do corpo da requisição, usando o algoritmo sha1 com a chave secreta do webhook (disponível na página do webhook) como chave de criptografia (ver exemplo ao lado).
User-Agent                  | `AtendeSimples-Robot` + o ambiente que originou a requisição.
Content-Type                | Formato do [payload](#payloads), de acordo com o que for configurado no webhook. Os formatos disponíveis são `application/json` e `application/x-www-form-urlencoded`.

> Exemplo de como gerar o X-Hub-Signature:

```ruby
# Chave secreta do webhook
key = '31f439e8b93520776732ad97e129700d9d1020ed'

# Corpo da requisição
body = '{"event_code":"call.finished","object":{"id":"123123"}}'

digest = OpenSSL::Digest.new('sha1')
OpenSSL::HMAC.hexdigest(digest, key, body)
=> 'c7fb37d21fc3a868e346eca1d89af5ce15f83317'
```

```sh
# Chave secreta do webhook
$ key='31f439e8b93520776732ad97e129700d9d1020ed'

# Corpo da requisição
$ body='{"event_code":"call.finished","object":{"id":"123123"}}'

$ echo -n $body | openssl dgst -sha1 -hmac $key
c7fb37d21fc3a868e346eca1d89af5ce15f83317
```

## Eventos

Todo evento possui um código que identifica o seu tipo. Esses códigos são formatados no padrão `resource.event`, sendo `resource` o nome do recurso e `event` o nome do evento disparado. Na tabela abaixo estão listados todos os tipos de eventos do Atende Simples:

       Código        |        Descrição
---------------------|-----------------------------------------------
call.newcall         | Quando uma chamada nova é iniciada.
call.b_leg_answered  | Quando uma chamada é atendida pela ponta B.
call.finished        | Quando uma chamada é finalizada.
call.audio_available | Quando o áudio de uma chamada fica disponível para dar play.
call.call_tag        | Quando uma chamada é classificada pela ponta B.

Ao configurar um webhook, você seleciona quais desses eventos ele escutará. Marcar somente os eventos específicos que você precisa tratar pode ajudar a limitar a quantidade de requisições HTTP que a sua aplicação receberá. Somente os eventos selecionados farão com que o webhook dispare requisições.

**Nota:** Independentemente de existir webhooks configurados ou não, o Atende Simples registra todos os eventos internamente (com exceção do [ping](#evento-ping)) e os disponibiliza no [Log de eventos][log_eventos] por um tempo limitado.


### Evento Ping

O evento ping é um evento especial disparado para testar se a URL do webhook está funcionando. Quando um webhook é criado, é necessário fazer a ativação do mesmo através do botão "Enviar ping", que dispara um evento ping.

Esse evento não é registrado no log de eventos.

### Eventos Coringa (Wildcard)

Eventos coringa (wildcard) não são eventos que acontecem no Atende Simples, são apenas representações de um conjunto de eventos que um webhook pode escutar. Os eventos coringa disponíveis são:

       Código        |        Descrição
---------------------|-----------------------------------------------
\*                   | Todos os eventos do Atende Simples, inclusive os que ainda surgirão.
call.*               | Todos os eventos do recurso `call` (chamada), inclusive os que ainda surgirão.

## Payloads

<blockquote>
  <strong>Exemplos de payloads:</strong>
</blockquote>

> Payload do evento ***ping***:

```json
{
  "event_code": "ping",
  "webhook": {
    "id": 1,
    "url": "http://seu-site.com/15a0nqn1"
  }
}
```

> Payload dos eventos ***call.\****:

```json
{
  "id": 1003,
  "from_number": "552122334466",
  "dnis": "5",
  "call_started_at": "2011-01-01T01:11:00.000-02:00",
  "status": "answered",
  "status_details": "conference",
  "business_hours": "worktime",
  "inbound_amount": "10.0",
  "total_amount": "15.0",
  "billed_duration": 900,
  "inbound_duration": 900,
  "selected_options": [
    "1",
    "3",
    "2"
  ],
  "call_tags": [
    {
      "code": "70",
      "description": "Lead",
      "status": "200"
    },
    {
      "code": " 71",
      "description": "Follow up",
      "status": "0"
    }
  ],
  "audio_url": "https://app.atendesimples.com/public/audios/98b2ec022a7f051a84e65b",
  "outbound_calls": [
    {
      "started_at": "2011-01-01T01:11:00.000-02:00",
      "phone_number": "123456",
      "name": "Jane Doe",
      "extension": 22,
      "duration": 5,
      "amount": "27.0"
    },
    {
      "started_at": "2011-01-01T01:11:00.000-02:00",
      "phone_number": "123456",
      "name": "Jane Doe",
      "extension": 22,
      "duration": 5,
      "amount": "27.0"
    },
    {
      "started_at": "2011-01-01T01:11:00.000-02:00",
      "phone_number": "123456",
      "name": "Jane Doe",
      "extension": 22,
      "duration": 5,
      "amount": "27.0"
    }
  ]
}
```

As requisições enviadas pelos webhooks possuem um conjunto de informações chamado de **payload**, que contém dados do recurso (do momento que o evento ocorre) e dados do próprio evento. Essas informações são estruturadas nos seguintes campos:

           |                          |
-----------|--------------------------|
event_code | Código do evento que originou a requisição, seguindo o padrão `resource.event`.
webhook    | Dados do webhook que disparou a requisição.
object     | Dados do recurso relacionado ao evento, no momento em que ele ocorreu.
changes    | Mudanças realizadas no recurso (presente somente quando `event` for `updated`).

Veja exemplos de payloads para todos os tipos de evento na coluna ao lado.

### Call

    Campo              |  Tipo   |  Descrição
-----------------------|---------|-----------------------------------------------
id                     | Integer | Código identificador da chamada.
from_number            | String  | Número do telefone de quem ligou para o seu atendimento (ponta A), no formato `código do país` + `DDD` + `telefone`. Exemplo: `"552130409670"`.
dnis                   | String  | Número do seu atendimento, no formato `código do país` + `número`. Exemplo: `"5508008871565"`.
call_started_at        | DateTime| Data e hora do início da chamada, com fuso horário -0300 (referente ao do Brasil, GMT-3). Exemplo: `"2015-05-07 16:26:05 -0300"`.
status                 | String  | Status da chamada no momento do evento. Os status possíveis são: `newcall`, `in_progress`, `abandoned`, `answered`, `blocked`, `handled` e `missed`.
status_details         | String  | Complemento do status. Pode vir com o nome do atendente que atendeu a ligação, uma mensagem personalizada ou com a mensagem `"Desligada"`.
business_hours         | String  | Identifica se a chamada ocorreu dentro ou fora do horário de atendimento configurado. Os valores possíveis são: `worktime` e `out_of_worktime`.
inbound_amount         | Float   | Valor cobrado referente a chamada recebida (entrante).
total_amount           | Float   | Valor total cobrado pela chamada (incluindo a chamada recebida e os reencaminhamentos).
billed_duration        | Integer | Duração arredondada da chamada (em segundos) considerada para cobrança.
inbound_duration       | Integer | Duração real da chamada (em segundos), sem arredondamento.
selected_options       | Array   | Opções do menu digitadas por quem ligou, na ordem em que forem digitadas. Se o atendimento for automático, ou seja, sem menu de opções, o valor retornado será sempre `"1"`. Dependendo da configuração do atendimento, é possível digitar mais de uma opção. Exemplo: `["1", "3"]`.
call_tags              | Array   | Classificações da chamada registradas por quem atendeu a ligação. Exemplo: `[{"code": "70", "description": "Lead"}]`.
call_tags &#65515; code       | String  | Código que o atendente digitou para efetuar a classificação.
call_tags &#65515; description| String  | Descrição referente ao código digitado na classificação.
audio_url              | String  | Link para o arquivo com a gravação da conversa ou áudio da caixa postal. Exemplo: `"https://app.atendesimples.com/public/audios/98b2ec022a7f051a84e65b"`.
outbound_calls         | Array   | Informações referente aos reencaminhamentos da chamada (pode haver mais de um). Só serão apresentados os reencaminhamentos que forem atendidos.
outbound_calls &#65515; started_at   | DateTime | Data e hora do reencaminhamento, com fuso horário -0300 (referente ao do Brasil, GMT-3). Exemplo: `"2011-05-07 17:26:05 -0300"`.
outbound_calls &#65515; phone_number | String   | Número do telefone que atendeu o reencaminhamento. Exemplo: `"5511999999999"`.
outbound_calls &#65515; name         | String   | Nome do atendente que atendeu o reencaminhamento. Exemplo: `"João"`.
outbound_calls &#65515; extension    | Integer  | Ramal do atendente que atendeu o reencaminhamento. Exemplo: `22`.
outbound_calls &#65515; duration     | Integer  | Duração em segundos do reencaminhamento.
outbound_calls &#65515; amount       | Float    | Valor cobrado pelo reencaminhamento. Exemplo: `17.28`.

[uuid]: https://en.wikipedia.org/wiki/Universally_unique_identifier
[log_eventos]: http://app.atendesimples.com/webhook/event_logs
