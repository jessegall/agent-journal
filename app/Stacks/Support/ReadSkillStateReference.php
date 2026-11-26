<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;

/**
 * Builds the reading state of one session's agent; the state takes the skills to read from the asks that reach it.
 */
final class ReadSkillStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.skills.read';
    }

    public static function forSession(string $sessionId): StateReference
    {
        return self::about(new SubjectReference($sessionId, 0), ['sessionId' => $sessionId]);
    }
}
