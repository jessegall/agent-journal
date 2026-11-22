<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What a supervisor start came to: its helper was started or already starts, or no helper can be started for it.
 */
enum SupervisorDispatchOutcome: string
{
    case Started = 'started';
    case Unavailable = 'unavailable';
}
