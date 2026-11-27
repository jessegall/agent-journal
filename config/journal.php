<?php

declare(strict_types=1);

use App\Stacks\ProfileState;
use App\Stacks\ReadyState;

return [

    'sessions' => [

        /*
        |--------------------------------------------------------------------------
        | Base States
        |--------------------------------------------------------------------------
        |
        | These states are held by every session for its whole life, listed from
        | the bottom up. The ready state must come first. Each entry may be a
        | state class or the reference class that builds it for a session.
        |
        */

        'base_states' => [
            ReadyState::class,
            ProfileState::class,
        ],

    ],

];
