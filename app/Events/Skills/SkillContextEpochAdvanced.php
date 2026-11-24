<?php

declare(strict_types=1);

namespace App\Events\Skills;

/**
 * A session's skill context moved on to a new epoch after a clear or compaction.
 */
final readonly class SkillContextEpochAdvanced extends SkillEvent
{
    public function __construct(
        public string $epochId,
    ) {}
}
