<?php

declare(strict_types=1);

namespace App\Recordings\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A recorded call breaks host protocol 1 as its generated readers read it, so the recording is not kept.
 */
final class RecordingBreaksProtocol extends RuntimeException
{
    public static function at(string $exchange, int $event, string $error, Throwable|null $cause = null): self
    {
        $message = "The recorded exchange {$exchange} breaks host protocol 1 at its event {$event}: {$error}";

        return new self($message, 0, $cause);
    }
}
