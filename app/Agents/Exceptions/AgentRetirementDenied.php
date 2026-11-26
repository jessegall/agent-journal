<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Support\ActorReference;
use RuntimeException;

final class AgentRetirementDenied extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forCaller(ActorReference $caller, string $agentId): self
    {
        return new self(
            sprintf(
                'The %s %s may not retire agent %s; only the owner, or a main agent retiring an agent that is not a main agent, may.',
                $caller->type,
                $caller->id,
                $agentId,
            ),
        );
    }

    protected function status(): int
    {
        return 403;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
