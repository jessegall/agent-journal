<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

/**
 * The parent's own helper whose agent is retired, so it cannot launch; its records are kept.
 */
final class HelperRetired extends RuntimeException implements CommandRefusal
{
    public static function forIdentity(string $identityId, Throwable $previous): self
    {
        return new self(sprintf(
            'Helper %s is retired and cannot launch. Choose an eligible identity; its history is retained.',
            $identityId,
        ), previous: $previous);
    }
}
