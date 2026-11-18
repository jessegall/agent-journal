<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class SkillOwnerRequired extends RuntimeException implements CommandRefusal
{
    public static function toRetire(string $key): self
    {
        return new self("Only the owner of the skill {$key} may retire it.");
    }
}
