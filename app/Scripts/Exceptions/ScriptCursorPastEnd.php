<?php

declare(strict_types=1);

namespace App\Scripts\Exceptions;

use LogicException;

/**
 * A script line was asked of a cursor that has read every line: the parser asks isAtEnd() first.
 */
final class ScriptCursorPastEnd extends LogicException
{
    public static function at(int $position): self
    {
        return new self("The script cursor has no line at {$position}.");
    }
}
