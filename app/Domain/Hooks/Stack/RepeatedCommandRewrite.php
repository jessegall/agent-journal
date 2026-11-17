<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use LogicException;

final class RepeatedCommandRewrite extends LogicException
{
    public static function for(string $firstLine, string $secondLine): self
    {
        return new self("A rewritten command was rewritten again, from {$firstLine} to {$secondLine}; a command is rewritten at most once.");
    }
}
