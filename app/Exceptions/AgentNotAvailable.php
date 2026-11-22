<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class AgentNotAvailable extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forAgent(string $agentId): self
    {
        return new self("Agent {$agentId} does not exist or is retired.");
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
