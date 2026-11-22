<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class SkillGenerationImmutable extends LogicException
{
    public static function for(string $generationId): self
    {
        return new self(
            "Skill generation {$generationId} is complete and its entries never change; refresh to make a new one.",
        );
    }
}
