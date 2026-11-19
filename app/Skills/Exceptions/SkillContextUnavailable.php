<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use RuntimeException;

/**
 * The facts a skill selection needs cannot be read for this agent: it never launched, or it is a helper launched
 * without the profile it needs. Nothing is selected for it.
 */
final class SkillContextUnavailable extends RuntimeException implements CodedRefusal
{
    public static function neverLaunched(string $agentId): self
    {
        return new self("Agent {$agentId} has no session to select skills for.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
