<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class ShippedSkillReadOnly extends RuntimeException implements CommandRefusal
{
    public static function for(string $key): self
    {
        return new self("The skill {$key} ships with the journal and cannot be edited; copy it to a user- key and edit the copy.");
    }
}
