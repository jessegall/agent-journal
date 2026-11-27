<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Connection
    |--------------------------------------------------------------------------
    |
    | The database connection the engine holds its lock on and writes through;
    | see config/database.php.
    |
    */

    'connection' => 'engine',

    /*
    |--------------------------------------------------------------------------
    | Lock Key
    |--------------------------------------------------------------------------
    |
    | The PostgreSQL advisory lock key that makes one engine process the owner
    | for this installation.
    |
    */

    'lock_key' => (int) env('ENGINE_LOCK_KEY', 7_350_013_581_206),

    /*
    |--------------------------------------------------------------------------
    | Pass Budget Milliseconds
    |--------------------------------------------------------------------------
    |
    | How long one engine pass may run, in milliseconds. A provisional limit,
    | to be measured.
    |
    */

    'pass_budget_ms' => 800,

    /*
    |--------------------------------------------------------------------------
    | Command Budget Milliseconds
    |--------------------------------------------------------------------------
    |
    | How long one command of a pass may run, in milliseconds. A provisional
    | limit, to be measured.
    |
    */

    'command_budget_ms' => 250,

    /*
    |--------------------------------------------------------------------------
    | Batch Size
    |--------------------------------------------------------------------------
    |
    | How many ticking frames one pass restores at most. A provisional limit,
    | to be measured.
    |
    */

    'batch_size' => 100,

    /*
    |--------------------------------------------------------------------------
    | Watchdog Seconds
    |--------------------------------------------------------------------------
    |
    | After how many seconds the process alarm ends a pass that hangs. A
    | provisional limit, to be measured.
    |
    */

    'watchdog_seconds' => 10,

    /*
    |--------------------------------------------------------------------------
    | Auto Assignments
    |--------------------------------------------------------------------------
    |
    | Filling auto-assignments: how often the engine considers them, how many
    | enabled facts one pass reads and how many it claims for, the most time
    | one pass spends on them (a slice of the pass, at most max_slice_ms and
    | at most slice_share of it), and the most ids one ordered pool may list.
    |
    */

    'auto_assignments' => [
        'interval_seconds' => 5,
        'facts_per_pass' => 20,
        'claims_per_pass' => 5,
        'max_slice_ms' => 100,
        'slice_share' => 0.2,
        'ordered_ids_max' => 1000,
    ],

];
