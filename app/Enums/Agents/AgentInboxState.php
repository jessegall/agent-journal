<?php

declare(strict_types=1);

namespace App\Enums\Agents;

enum AgentInboxState: string
{
    case Pending = 'pending';
    case Answered = 'answered';
    case All = 'all';
}
