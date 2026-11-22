<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A helper whose last job stopped unfinished: it is continued, or the new work goes to another identity.
 */
final class HelperJobUnfinished extends RuntimeException implements CommandRefusal
{
    public static function onJob(string $identityId, string $jobId): self
    {
        return new self(sprintf(
            'Helper %s has unfinished job %s. Continue that job, or choose another identity for new work.',
            $identityId,
            $jobId,
        ));
    }
}
