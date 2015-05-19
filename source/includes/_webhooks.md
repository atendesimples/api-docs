# Webhooks

## Eventos

Alguns eventos que ocorrem no Atende Simples são registrados internamente. Cada vez que isso acontece, uma notificação é emitida para os webhooks ativos e configurados para serem notificados sobre esse evento. Para ver os seus eventos registrados, acesse o [Log de eventos](http://app.atendesimples.com/webhook/event_logs) da sua conta.

Os códigos dos eventos seguem um padrão `resource.event`, onde `resource` é o nome do recurso que gerou o evento e `event` é o nome do evento ocorrido.

Os eventos possíveis que podem ser registrados pelo Atende Simples são:

       Código        |        Descrição
---------------------|------------------------------------
call.finished        | Toda vez que uma chamada é finalizada.
call.audio_available | Toda vez que o áudio da chamada termina de ser processado.
