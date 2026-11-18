<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class SkillRevisionConflict extends RuntimeException implements CommandRefusal
{
    public static function latest(string $key, int $latest): self
    {
        return new self("The skill {$key} is at revision {$latest} now; read it and save against revision {$latest}.");
    }
}
