<?php

declare(strict_types=1);

namespace App\Enums;

enum ToolOutcome: string
{
    case Succeeded = 'succeeded';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
}
