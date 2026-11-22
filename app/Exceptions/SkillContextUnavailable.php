<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * The facts a skill selection needs cannot be read for this agent: it never started, or it is a helper started
 * without the profile it needs. Nothing is selected for it.
 */
final class SkillContextUnavailable extends RuntimeException implements CodedRefusal
{
    public static function neverStarted(string $agentId): self
    {
        return new self("Agent {$agentId} has no session to select skills for.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
