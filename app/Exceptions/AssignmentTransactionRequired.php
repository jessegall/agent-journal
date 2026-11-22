<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class AssignmentTransactionRequired extends LogicException
{
    public static function forStore(): self
    {
        return new self('Assignments are read and written only inside an assignment transaction.');
    }

    public static function forIsolation(string $isolation): self
    {
        return new self("Assignment work joins only a repeatable-read transaction; the open one is {$isolation}.");
    }
}
