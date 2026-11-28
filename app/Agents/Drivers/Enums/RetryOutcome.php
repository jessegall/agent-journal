<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

enum RetryOutcome: string
{
    case Succeeded = 'succeeded';
    case Failed = 'failed';
    case GaveUp = 'gave_up';
}
