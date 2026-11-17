<?php

declare(strict_types=1);

return [

    /*
    | How long after an agent issued a hook call a retry of it is still accepted, in seconds. Doc 3 caps it at five minutes.
    */
    'retry_seconds' => (int) env('HOOK_RETRY_SECONDS', 300),

    /*
    | How long an answered hook call is kept, in days; it must be longer than the retry window.
    */
    'hook_call_days' => (int) env('HOOK_CALL_DAYS', 7),

    /*
    | How long a closed stack is kept, in days. Active stacks and stacks held for an investigation are never pruned.
    */
    'closed_stack_days' => (int) env('HOOK_CLOSED_STACK_DAYS', 30),

    /*
    | How long one stack operation outside a hook may take.
    */
    'operation_deadline_milliseconds' => (int) env('HOOK_OPERATION_DEADLINE_MILLISECONDS', 5000),

];
