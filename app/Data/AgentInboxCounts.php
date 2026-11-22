<?php

declare(strict_types=1);

namespace App\Data;

final readonly class AgentInboxCounts
{
    public function __construct(public int $unread, public int $pending) {}
}
