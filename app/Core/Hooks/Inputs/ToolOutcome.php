<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

enum ToolOutcome: string
{
    case Succeeded = 'succeeded';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
}
