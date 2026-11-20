<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use RuntimeException;

/**
 * The context a helper's job needs cannot be built, so its session stays unprepared rather than start on a partial
 * brief.
 */
final class ContextUnavailable extends RuntimeException
{
    public static function forJob(string $jobId): self
    {
        return new self("The context of helper job {$jobId} cannot be built: its purpose is missing.");
    }
}
