<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\PublicationState;
use App\Enums\ReadEvidence;
use App\Models\Skills\SkillContextEpoch;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Models\Skills\SkillReceipt;

/**
 * Turns proven evidence of a whole read into a receipt for the text the session was delivered; a skill outside its
 * delivered set, or a session with nothing delivered, records nothing.
 */
final readonly class SkillReads
{
    /**
     * Whether the read was recorded.
     */
    public function record(string $sessionId, string $skillKey, ReadEvidence $evidence): bool
    {
        $publication = SkillPublication::latestOfSession($sessionId);

        if ($publication === null || $publication->state !== PublicationState::Delivered) {
            return false;
        }

        $entry = in_array($skillKey, $publication->skill_keys, true)
            ? SkillGeneration::findForPublication($publication)->entry($skillKey)
            : null;

        if ($entry === null) {
            return false;
        }

        SkillReceipt::record(
            $sessionId,
            SkillContextEpoch::currentOf($sessionId),
            $skillKey,
            $entry['digest'],
            $evidence,
        );

        return true;
    }
}
