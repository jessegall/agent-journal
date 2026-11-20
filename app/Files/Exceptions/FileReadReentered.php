<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Values\FilePath;
use LogicException;

/**
 * A read, list or walk started while another was still running in the same worker, as a parser or a listener that
 * reads during a read would start one.
 */
final class FileReadReentered extends LogicException
{
    public static function inside(FilePath $outer, FilePath $inner): self
    {
        return new self(
            "{$inner->label()} was read while {$outer->label()} was still being read; read the two one after the other.",
        );
    }
}
