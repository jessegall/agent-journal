<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use RuntimeException;

/**
 * An agent the actor of this request may not see; its skills are not explained to them.
 */
final class SkillAgentHidden extends RuntimeException
{
    public static function for(): self
    {
        return new self('That agent is not one you may see.');
    }
}
