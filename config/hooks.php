<?php

declare(strict_types=1);

return [

    /*
    | How long after an agent issued a hook call a retry of it is still accepted, in seconds. Doc 3 caps it at five minutes.
    */
    'retry_seconds' => (int) env('HOOK_RETRY_SECONDS', 300),

    /*
    | How long one stack operation outside a hook, such as a domain pushing a state, may take before it is rolled back, in milliseconds.
    */
    'operation_deadline_milliseconds' => (int) env('HOOK_OPERATION_DEADLINE_MILLISECONDS', 5000),

];
