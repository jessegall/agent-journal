<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A switch that expected a session or process generation the agent no longer runs: another change won first.
 */
final class DriverSwitchStale extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forAgent(string $agentId, string|null $currentSessionId): self
    {
        return new self(sprintf(
            'Agent %s no longer runs the session this switch expected; it runs %s now. Review it and switch again.',
            $agentId,
            $currentSessionId ?? 'none',
        ));
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
