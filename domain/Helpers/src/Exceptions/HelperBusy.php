<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

/**
 * A helper already working on a job, or one another start reserved first; the work is never redirected.
 */
final class HelperBusy extends RuntimeException implements CommandRefusal
{
    public static function onJob(string $identityId, string $jobId): self
    {
        return new self(sprintf(
            'Helper %s is working on job %s. Use --steer for that job, or dispatch another helper for separate work.',
            $identityId,
            $jobId,
        ));
    }

    public static function running(string $identityId, Throwable $previous): self
    {
        return new self(sprintf(
            'Helper %s is already running. Use --steer for its job, or dispatch another helper for separate work.',
            $identityId,
        ), previous: $previous);
    }
}
