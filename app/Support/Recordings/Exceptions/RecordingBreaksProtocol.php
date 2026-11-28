<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A recorded exchange breaks the host protocol it was recorded under.
 */
final class RecordingBreaksProtocol extends RuntimeException
{
    public static function at(int $protocol, string $exchange, int $event, string $error, Throwable|null $cause = null): self
    {
        $message = "The recorded exchange {$exchange} breaks host protocol {$protocol} at its event {$event}: {$error}";

        return new self($message, 0, $cause);
    }
}
