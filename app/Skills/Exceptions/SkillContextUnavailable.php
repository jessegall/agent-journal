<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use RuntimeException;

/**
 * The facts a skill selection needs cannot be read for this agent: it never launched, or it is a helper launched
 * without the profile it needs. Nothing is selected for it.
 */
final class SkillContextUnavailable extends RuntimeException
{
    public static function neverLaunched(string $agentId): self
    {
        return new self("Agent {$agentId} has no session to select skills for.");
    }

    public static function profileRequired(string $agentId): self
    {
        return new self("Agent {$agentId} is a helper launched without a profile; a helper needs one to receive skills.");
    }
}
