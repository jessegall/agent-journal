<?php

declare(strict_types=1);

return [

    /*
    | How long after an agent issued a hook call a retry of it is still accepted, in seconds. Doc 3 caps it at five minutes.
    */
    'retry_seconds' => (int) env('HOOK_RETRY_SECONDS', 300),

];
