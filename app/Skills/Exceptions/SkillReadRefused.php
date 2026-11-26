<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * An ask to read skills the session cannot take: it has ended, or one of the skills was never handed to it.
 */
final class SkillReadRefused extends RuntimeException implements CodedRefusal
{
    public static function sessionEnded(string $sessionId): self
    {
        return new self("Session {$sessionId} is not active, so it cannot be asked to read skills.");
    }

    public static function notHanded(string $skillKey): self
    {
        return new self("The skill {$skillKey} was not handed to this session, so it cannot be read here.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
