<?php

declare(strict_types=1);

return [

    /*
    | How long a launch may send no heartbeat before its loss is suspected, in seconds.
    */
    'suspect_loss_after_seconds' => (int) env('AGENT_SUSPECT_LOSS_AFTER_SECONDS', 120),

    /*
    | How long a suspected loss lasts before it is confirmed and the launch's session ends, in seconds.
    */
    'confirm_loss_after_seconds' => (int) env('AGENT_CONFIRM_LOSS_AFTER_SECONDS', 900),

];
