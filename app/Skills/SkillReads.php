<?php

declare(strict_types=1);

namespace App\Skills;

use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillContextEpoch;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillReceipt;
use App\Skills\Enums\ReadEvidence;

/**
 * Turns proven evidence of a whole read into a receipt for the text the session was handed; a skill outside its
 * handed set, or a session handed nothing, records nothing.
 */
final readonly class SkillReads
{
    /**
     * Whether the read was recorded.
     */
    public function record(string $sessionId, string $skillKey, ReadEvidence $evidence): bool
    {
        $session = AgentSession::findById($sessionId);
        $generationId = $session->skill_generation_id;

        $entry = $generationId !== null && $session->hasSkill($skillKey)
            ? SkillGeneration::findById($generationId)->entry($skillKey)
            : null;

        if ($entry === null) {
            return false;
        }

        SkillReceipt::create(
            $sessionId,
            SkillContextEpoch::resolveCurrentOf($sessionId),
            $skillKey,
            $entry->digest,
            $evidence,
        );

        return true;
    }
}
