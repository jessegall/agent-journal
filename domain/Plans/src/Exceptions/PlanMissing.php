<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use RuntimeException;

/**
 * No plan has the id asked for; the message is safe to show.
 */
final class PlanMissing extends RuntimeException
{
    public static function withId(int $planId): self
    {
        return new self("Plan {$planId} does not exist.");
    }
}
