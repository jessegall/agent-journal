<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Values\FilePath;
use RuntimeException;

/**
 * A path that leads out of its place through a link, or whose file was swapped for another between check and open.
 */
final class LinkLeavesPlace extends RuntimeException
{
    public static function from(FilePath $file): self
    {
        return new self("{$file->label()} leads out of its place through a link, so it is not opened.");
    }
}
