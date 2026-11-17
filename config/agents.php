<?php

declare(strict_types=1);

return [

    /*
    | How long a launch may send no heartbeat before it is silent, in seconds.
    */
    'silent_after_seconds' => (int) env('AGENT_SILENT_AFTER_SECONDS', 120),

    /*
    | How long a launch may stay silent before it times out and its session ends, in seconds.
    */
    'timed_out_after_seconds' => (int) env('AGENT_TIMED_OUT_AFTER_SECONDS', 900),

];
