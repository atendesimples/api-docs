# Webhooks

## Eventos

Alguns eventos que ocorrem no Atende Simples são registrados internamente. Cada vez que isso acontece, uma notificação é emitida para os webhooks ativos e configurados para serem notificados sobre esse evento. Para ver os seus eventos registrados, acesse o [Log de eventos](http://app.atendesimples.com/webhook/event_logs) da sua conta.

Os códigos dos eventos seguem um padrão `resource.event`, onde `resource` é o nome do recurso que gerou o evento e `event` é o nome do evento ocorrido.

Os eventos possíveis que podem ser registrados pelo Atende Simples são:

       Código        |        Descrição
---------------------|------------------------------------
call.newcall         | Toda vez que uma chamada nova é iniciada.
call.finished        | Toda vez que uma chamada é finalizada.
call.audio_available | Toda vez que o áudio da chamada termina de ser processado.

## Payloads

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

O payload é o conteúdo enviado numa notificação disparada pelo webhook. Sua estrutura é composta pelos campos:

           |                          |
-----------|--------------------------|
event_code | Código do evento que originou a notificação, geralmente no padrão `resource.event`
webhook    | Informações do webhook para o qual a notificação foi disparada
object     | Informações do recurso relacionado ao evento
changes    | Mudanças realizadas no recurso (somente quando o evento for `*.updated`)

