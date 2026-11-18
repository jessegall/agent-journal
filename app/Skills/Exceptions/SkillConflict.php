<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use LogicException;

/**
 * Two skills declared under one key; neither wins until one of them is renamed.
 */
final class SkillConflict extends LogicException
{
    public static function between(string $key, string $firstOwner, string $secondOwner): self
    {
        return new self("{$firstOwner} and {$secondOwner} both declare the skill key {$key}; rename one of them.");
    }
}
