<?php

declare(strict_types=1);

namespace App\Core\Agents\Exceptions;

use RuntimeException;

final class AgentNotAvailable extends RuntimeException
{
    public static function forAgent(int $agentId): self
    {
        return new self("Agent {$agentId} does not exist or is retired.");
    }
}
