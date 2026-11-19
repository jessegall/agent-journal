<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
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
