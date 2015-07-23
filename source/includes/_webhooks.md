# Webhooks

Webhooks são integrações [configuradas na sua conta](http://app.atendesimples.com/webhooks) que escutarão a certos eventos do Atende Simples. Quando um evento ocorrer, o Atende Simples enviará uma notificação (requisição HTTP POST) para a URL configurada no webhook.

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
X-AtendeSimples-Event       | [Código do evento](#eventos) que gerou a notificação.
X-AtendeSimples-Request-Id  | ID único da notificação/requisição, no formato [UUID][uuid].
X-AtendeSimples-Environment | Ambiente de onde a notificação foi disparada (`production` ou `staging`).
X-Hub-Signature             | Assinatura de segurança, para a sua aplicação verificar a autenticidade da requisição.
User-Agent                  | `AtendeSimples-Robot` + o ambiente que originou a notificação.
Content-Type                | Formato do [payload](#payloads), de acordo com o que for configurado no webhook. Os formatos disponíveis são `application/json` e `application/x-www-form-urlencoded`.

## Eventos

Todo evento possui um código que identifica o seu tipo. Esses códigos são formatados no padrão `resource.event`, sendo `resource` o nome do recurso e `event` o nome do evento disparado. Na tabela abaixo estão listados todos os tipos de eventos do Atende Simples:

       Código        |        Descrição
---------------------|-----------------------------------------------
call.newcall         | Quando uma chamada nova é iniciada.
call.b_leg_answered  | Quando uma chamada é atendida pela ponta B.
call.finished        | Quando uma chamada é finalizada.
call.audio_available | Quando o áudio de uma chamada fica disponível para dar play.
call.call_tag        | Quando uma chamada é classificada pela ponta B.

Ao configurar um webhook, você seleciona quais desses eventos ele escutará. Marcar somente os eventos específicos que você precisa tratar pode ajudar a limitar a quantidade de requisições HTTP que a sua aplicação receberá. Somente os eventos selecionados farão com que o webhook dispare notificações.

**Nota:** Independentemente de existir webhooks configurados ou não, o Atende Simples registra todos os eventos internamente (menos o [ping](#evento-ping)) e os disponibiliza no [Log de eventos][log_eventos], por tempo limitado.


### Evento Ping

O evento ping é um evento especial disparado para testar se a URL do webhook está funcionando. Quando um webhook é criado, é necessário fazer a ativação do mesmo através do botão "Enviar ping", que dispara um evento ping.

Esse evento não é registrado no log de eventos.

### Eventos Coringa (Wildcard)

Eventos coringa (wildcard) não são eventos que acontecem no Atende Simples, são apenas representações de um conjunto de eventos que um webhook deve escutar. Os eventos coringa disponíveis são:

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
  "event_code": "call.finished",
  "webhook": {
    "id": 1,
    "url": "http://seu-site.com/callbacks/atendesimples"
  },
  "object": {
    "call_id": 1003,
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
    "audio_url": "http://s3.amazon.com/123456/audio.mp3",
    "outbound_calls": [
      {
        "started_at": "2011-01-01T01:11:00.000-02:00",
        "phone_number": "5511999999999",
        "name": "João",
        "extension": 22,
        "duration": 64,
        "amount": "17.28"
      },
      {
        "started_at": "2011-01-01T01:11:00.000-02:00",
        "phone_number": "5531999999999",
        "name": "Patricia",
        "extension": 23,
        "duration": 10,
        "amount": "2.7"
      },
      {
        "started_at": "2011-01-01T01:11:00.000-02:00",
        "phone_number": "123456",
        "name": "Fernando",
        "extension": 21,
        "duration": 10,
        "amount": "2.7"
      }
    ]
  }
}
```

As notificações enviadas pelos webhooks possuem um conjunto de informações chamado de **payload**, que contém dados do recurso (naquele determinado momento) e dados do próprio evento. Essas informações são estruturadas nos seguintes campos:

           |                          |
-----------|--------------------------|
event_code | Código do evento que originou a notificação, seguindo o padrão `resource.event`.
webhook    | Dados do webhook que disparou a notificação.
object     | Dados do recurso relacionado ao evento, no momento em que o evento ocorreu.
changes    | Mudanças realizadas no recurso (presente somente quando `event` for `updated`).

Veja exemplos de payloads para todos os tipos de evento na coluna ao lado.

[uuid]: https://en.wikipedia.org/wiki/Universally_unique_identifier
[log_eventos]: http://app.atendesimples.com/webhook/event_logs
