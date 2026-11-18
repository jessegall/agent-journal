<?php

declare(strict_types=1);

return [

    /*
    | The database connection the engine holds its lock on and writes through; see config/database.php.
    */
    'connection' => 'engine',

    /*
    | The PostgreSQL advisory lock key that makes one engine process the owner for this installation.
    */
    'lock_key' => (int) env('ENGINE_LOCK_KEY', 7_350_013_581_206),

    /*
    | How long one engine pass may run, in milliseconds. A provisional limit, to be measured.
    */
    'pass_budget_ms' => 800,

    /*
    | How long one command of a pass may run, in milliseconds. A provisional limit, to be measured.
    */
    'command_budget_ms' => 250,

    /*
    | How many ticking frames one pass restores at most. A provisional limit, to be measured.
    */
    'batch_size' => 100,

    /*
    | After how many seconds the process alarm ends a pass that hangs. A provisional limit, to be measured.
    */
    'watchdog_seconds' => 10,

];
