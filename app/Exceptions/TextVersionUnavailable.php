<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A text version that does not exist or is not published.
 */
final class TextVersionUnavailable extends RuntimeException implements CommandRefusal
{
    public static function named(string $version): self
    {
        return new self("Version {$version} of this text does not exist or is not published.");
    }
}
