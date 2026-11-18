<?php

declare(strict_types=1);

return [

    /*
     * Whether this host may run admitted command lines under the supervisor. Off until a host is set up for it; while
     * off, every start refuses with runner-unavailable and nothing spawns.
     */
    'runner' => (bool) env('JOURNAL_PROCESS_RUNNER', false),

];
