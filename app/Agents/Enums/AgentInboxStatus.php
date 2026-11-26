<?php

declare(strict_types=1);

namespace App\Agents\Enums;

enum AgentInboxStatus: string
{
    case Pending = 'pending';
    case Answered = 'answered';
    case All = 'all';
}
