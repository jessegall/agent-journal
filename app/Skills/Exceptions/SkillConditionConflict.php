<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use LogicException;

/**
 * Two owners registered one named condition key.
 */
final class SkillConditionConflict extends LogicException
{
    public static function between(string $key, string $firstOwner, string $secondOwner): self
    {
        return new self("{$firstOwner} and {$secondOwner} both register the skill condition {$key}.");
    }
}
