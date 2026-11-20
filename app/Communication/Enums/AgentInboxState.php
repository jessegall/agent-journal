<?php

declare(strict_types=1);

namespace App\Communication\Enums;

enum AgentInboxState: string
{
    case Pending = 'pending';
    case Answered = 'answered';
    case All = 'all';
}
