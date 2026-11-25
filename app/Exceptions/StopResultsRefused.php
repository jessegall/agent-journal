<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * The host's results for a stop attempt do not belong to it: another policy, workspace generation or set of
 * conditions, or a different submission after the attempt was settled. Nothing is stored.
 */
final class StopResultsRefused extends RuntimeException implements CommandRefusal
{
    /** @use ThrowsLater<StopResultsRefused> */
    use ThrowsLater;

    public static function unknownAttempt(string $attemptId): self
    {
        return new self(sprintf('There is no stop attempt %s, so its results are not stored.', $attemptId));
    }

    public static function stale(string $attemptId): self
    {
        return new self(sprintf(
            'The results name another policy or workspace generation than stop attempt %s, so they are not stored.',
            $attemptId,
        ));
    }

    public static function otherConditions(string $attemptId): self
    {
        return new self(sprintf(
            'The results do not cover exactly the conditions stop attempt %s asked for, so they are not stored.',
            $attemptId,
        ));
    }

    public static function conflicting(string $attemptId): self
    {
        return new self(sprintf(
            'Stop attempt %s already holds other results; a changed submission is refused.',
            $attemptId,
        ));
    }
}
