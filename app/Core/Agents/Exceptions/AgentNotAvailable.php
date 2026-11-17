<?php

declare(strict_types=1);

namespace App\Core\Agents\Exceptions;

use App\Core\Assignments\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

final class AgentNotAvailable extends RuntimeException
{
    use RendersRefusal;

    public static function forAgent(int $agentId): self
    {
        return new self("Agent {$agentId} does not exist or is retired.");
    }

    protected function status(): int
    {
        return 422;
    }
}
