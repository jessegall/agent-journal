<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;
use Throwable;

/**
 * The source to dock is missing, the actor may not read it, or its type or presentation cannot be docked; a missing
 * source and an unreadable one are refused alike.
 */
final class DockSourceUnavailable extends RuntimeException implements CommandRefusal
{
    /** @use ThrowsLater<DockSourceUnavailable> */
    use ThrowsLater;

    public static function of(string $type, string $id): self
    {
        return new self("No {$type} {$id} can be docked.");
    }

    public static function unsupported(string $type, string $presentation, Throwable|null $cause = null): self
    {
        return new self("Nothing of type {$type} can be docked as {$presentation}.", 0, $cause);
    }

    public static function unreadable(string $type, string $id, Throwable $cause): self
    {
        return new self("No {$type} {$id} can be docked.", 0, $cause);
    }
}
