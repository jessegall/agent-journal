<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A helper whose job is held while nobody knows whether its last launch still runs.
 */
final class HelperStartUncertain extends RuntimeException implements CommandRefusal
{
    public static function forIdentity(string $identityId): self
    {
        return new self(sprintf(
            'Helper %s may still be running. Reconcile or stop that launch before continuing it.',
            $identityId,
        ));
    }
}
