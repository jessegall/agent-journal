<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use LogicException;

/**
 * A file whose tree this run already made was parsed again: every reader takes the tree ParsedTrees holds.
 */
final class ParsedTwice extends LogicException
{
    public static function for(string $path): self
    {
        return new self("{$path} was parsed a second time in this run; read its tree through ParsedTrees.");
    }
}
