<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A repeat of a dispatch request id that asks something else than the job it already made.
 */
final class HelperRequestConflict extends RuntimeException implements CommandRefusal
{
    public static function forRequest(string $requestId): self
    {
        return new self(sprintf(
            'Request %s already dispatched a different job. Send the new work under a new request id.',
            $requestId,
        ));
    }
}
