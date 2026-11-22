<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A helper job that is finished, cancelled or failed is not continued; new work goes to the helper as a send.
 */
final class HelperJobAlreadyEnded extends RuntimeException implements CommandRefusal
{
    public static function withSendCommand(string $jobId, string $state, string $command): self
    {
        return new self(sprintf(
            'Helper job %s is %s and is not continued. Give the helper new work instead: %s',
            $jobId,
            $state,
            $command,
        ));
    }
}
