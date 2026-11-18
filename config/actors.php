<?php

declare(strict_types=1);

return [

    /*
    | How long a heartbeat keeps an actor present, in seconds. It is also how long an agent session may send no beat
    | before it is silent. A beat counts while database now is strictly less than the beat plus this window.
    */
    'presence_seconds' => (int) env('ACTOR_PRESENCE_SECONDS', 120),

    /*
    | How often a healthy sender beats, in seconds; never more than 60, so a beat always lands inside the window.
    */
    'heartbeat_seconds' => 30,

    /*
    | How old an agent session's stored beat must be before a signed call of that agent records a new one, in seconds,
    | so a busy agent stays present without a write on every request.
    */
    'signed_call_refresh_seconds' => 15,

];
