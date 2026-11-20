<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use RuntimeException;

/**
 * A path that leads out of its place through a link, or whose file was swapped for another between check and open.
 */
final class LinkLeavesPlace extends RuntimeException
{
    public static function from(string $path): self
    {
        return new self("{$path} leads out of its place through a link, so it is not opened.");
    }
}
