<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A listener of a committed fact failed. The fact's producer stays committed and every other fact was still handed
 * out; the failure is thrown, never kept to a log line, so it is seen where it happens.
 */
final class CommittedFactListenerFailed extends RuntimeException
{
    public static function for(string $event, Throwable $failure): self
    {
        return self::of($event, 'a listener', $failure);
    }

    public static function of(string $event, string $listener, Throwable $failure): self
    {
        $cause = $failure::class;

        return new self(
            "{$listener} failed on the committed fact {$event} with {$cause}: {$failure->getMessage()}",
            0,
            $failure,
        );
    }
}
