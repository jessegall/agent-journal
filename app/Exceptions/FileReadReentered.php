<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A read, list or walk started while another was still running in the same worker, as a parser or a listener that
 * reads during a read would start one.
 */
final class FileReadReentered extends LogicException
{
    public static function inside(string $outer, string $inner): self
    {
        return new self(
            "{$inner} was read while {$outer} was still being read; read the two one after the other.",
        );
    }
}
