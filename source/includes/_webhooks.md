# Webhooks

Webhooks são procedimentos [configurados na sua conta Atende Simples](http://app.atendesimples.com/webhooks) para disparar notificações (requisições HTTP POST) para sistemas externos sempre que ocorrer algum evento no Atende Simples.

Um **evento** é um *ação* que acontece com um determinado **recurso**, por exemplo, quando uma ***chamada*** é ***atendida***. Ao receber uma notificação, o seu site ou aplicação poderá executar diversas tarefas, de acordo com a necessidade da integração.

\* *Webhooks também são chamados de* ***Callbacks*** *ou* ***Reverse API***.

## Eventos

Todo evento possui um código que identifica o seu tipo. Esses códigos são formatados no padrão `resource.event`, sendo `resource` o nome do recurso e `event` o nome do evento disparado. Na tabela abaixo estão listados todos os tipos de eventos existentes no Atende Simples:

       Código        |        Descrição
---------------------|-----------------------------------------------
call.newcall         | Quando uma chamada nova é iniciada.
call.b_leg_answered  | Quando uma chamada é atendida pela ponta B.
call.finished        | Quando uma chamada é finalizada.
call.audio_available | Quando o áudio de uma chamada fica disponível para dar play.
call.call_tag        | Quando uma chamada é classificada pela ponta B.

Ao criar um webhook, você seleciona quais desses eventos ele escutará. Somente os eventos selecionados farão com que o webhook dispare notificações.

**Nota:** Independentemente de existir webhooks configurados ou não, o Atende Simples registra todos os eventos internamente e os disponibiliza no [Log de eventos](http://app.atendesimples.com/webhook/event_logs), por tempo limitado.


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

Na coluna do lado direito, veja exemplos de payloads para todos os tipos de evento.


