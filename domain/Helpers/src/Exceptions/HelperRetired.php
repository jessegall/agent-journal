<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

/**
 * The parent's own helper whose agent is retired, so it cannot start; its records are kept.
 */
final class HelperRetired extends RuntimeException implements CommandRefusal
{
    public static function forIdentity(string $identityId, Throwable $previous): self
    {
        return new self(sprintf(
            'Helper %s is retired and cannot start. Choose an eligible identity; its history is retained.',
            $identityId,
        ), previous: $previous);
    }

    /**
     * A replayed start of a job its retired helper left unfinished: nothing picks another helper silently.
     */
    public static function withUnfinishedJob(string $identityId, string $jobId): self
    {
        return new self(sprintf(
            'Helper %s is retired with job %s unfinished. Continue or replace it explicitly; its history is retained.',
            $identityId,
            $jobId,
        ));
    }
}
