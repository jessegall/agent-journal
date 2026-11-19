<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use LogicException;

/**
 * A finished, cancelled or failed helper job takes no further change.
 */
final class HelperJobFinished extends LogicException
{
    public static function forJob(string $jobId, string $state): self
    {
        return new self("Helper job {$jobId} is {$state} and takes no further change.");
    }
}
