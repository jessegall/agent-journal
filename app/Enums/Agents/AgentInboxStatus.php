<?php

declare(strict_types=1);

namespace App\Enums\Agents;

enum AgentInboxStatus: string
{
    case Pending = 'pending';
    case Answered = 'answered';
    case All = 'all';
}
