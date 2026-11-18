<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * No plan has the id asked for; the message is safe to show.
 */
final class PlanMissing extends RuntimeException implements CommandRefusal
{
    public static function withId(int $planId): self
    {
        return new self("Plan {$planId} does not exist.");
    }
}
