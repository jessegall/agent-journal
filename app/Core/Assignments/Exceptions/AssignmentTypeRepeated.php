<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use LogicException;

final class AssignmentTypeRepeated extends LogicException
{
    public static function for(string $type): self
    {
        return new self("The record type {$type} is declared assignable twice; one domain owns it.");
    }
}
