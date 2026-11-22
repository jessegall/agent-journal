<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class RepeatedCommandRewrite extends LogicException
{
    public static function for(string $firstLine, string $secondLine): self
    {
        return new self(
            sprintf(
                'A rewritten command was rewritten again, from %s to %s; a command is rewritten at most once.',
                $firstLine,
                $secondLine,
            ),
        );
    }
}
