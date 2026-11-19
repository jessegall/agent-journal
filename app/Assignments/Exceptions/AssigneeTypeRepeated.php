<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use LogicException;

final class AssigneeTypeRepeated extends LogicException
{
    public static function for(string $type): self
    {
        return new self("The assignee type {$type} is declared twice; one owner answers for it.");
    }
}
