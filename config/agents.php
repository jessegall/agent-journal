<?php

declare(strict_types=1);

return [

    /*
    | How long a launch may send no heartbeat before its loss is suspected, in seconds.
    */
    'possibly_lost_after_seconds' => (int) env('AGENT_POSSIBLY_LOST_AFTER_SECONDS', 120),

    /*
    | How long a suspected loss lasts before it is confirmed and the launch's session ends, in seconds.
    */
    'lost_after_seconds' => (int) env('AGENT_LOST_AFTER_SECONDS', 900),

];
