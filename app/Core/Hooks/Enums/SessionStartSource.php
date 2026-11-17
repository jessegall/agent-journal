<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

enum SessionStartSource: string
{
    case Startup = 'startup';
    case Resume = 'resume';
    case Clear = 'clear';
    case Compact = 'compact';
}
