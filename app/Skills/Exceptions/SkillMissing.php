<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Skills\Values\SkillKey;
use RuntimeException;

final class SkillMissing extends RuntimeException
{
    public static function for(SkillKey $key): self
    {
        return new self("There is no skill {$key}.");
    }
}
