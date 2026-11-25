<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * No plan has the id asked for; the message is safe to show.
 */
final class PlanMissing extends RuntimeException implements CommandRefusal
{
    /**
     * @use ThrowsLater<PlanMissing>
     */
    use ThrowsLater;

    public static function withId(string $planId): self
    {
        return new self("Plan {$planId} does not exist.");
    }
}
