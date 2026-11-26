<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Skills\Contracts\DriverSkills;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Enums\SkillReload;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\SkillSelection;
use App\Skills\Values\SelectedSkills;
use App\Skills\Values\SkillEntry;
use App\Values\AgentText;

/**
 * At every boundary of a session (start, clear, resume, compaction) selects its skills afresh from today's facts and
 * revisions and tells the agent what it cannot reach itself: a selection that cannot be made, and skills that differ
 * from the ones its start was handed when its driver loads skills only at a new session. It changes nothing: the
 * session keeps the files and the row its start gave it.
 */
final readonly class NoticeSkillsChanged implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private DriverSkillAdapters $adapters,
        private SkillResolver $skills,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $session = AgentSession::findById($event->target->sessionId);

        $generationId = $session->skill_generation_id;

        if ($generationId === null || ! $this->adapters->supportsSession($session)) {
            return;
        }

        try {
            $selected = $this->selection->select($this->skills->all(), $this->contexts->forSession($session));
        } catch (SkillSelectionConflict $conflict) {
            $notice = AgentText::of('core.skills.not_chosen', ['problem' => $conflict->getMessage()]);
            $event->reminders->add($notice, true);

            return;
        }

        $driver = $this->adapters->forSession($session);

        $reloadsAtNewSession = $driver->reloadMode() === SkillReload::NewSession;

        if ($reloadsAtNewSession && $this->differsFromHanded($session, $generationId, $selected)) {
            $event->reminders->add($this->newSessionNotice($driver, $selected), true);
        }
    }

    /**
     * Whether the selected keys, or the texts of the handed ones, are not what the session's start handed it.
     */
    private function differsFromHanded(AgentSession $session, string $generationId, SelectedSkills $selected): bool
    {
        if ($selected->selectedKeys() !== $session->skill_keys) {
            return true;
        }

        $handed = SkillGeneration::findById($generationId);

        return array_any(
            $selected->selected,
            fn (SkillEntry $skill) => $skill->rendered->digest !== $handed->entry($skill->key->key)?->digest,
        );
    }

    private function newSessionNotice(DriverSkills $driver, SelectedSkills $selected): AgentText
    {
        $keys = $selected->selectedKeys() === [] ? 'none' : implode(', ', $selected->selectedKeys());

        return AgentText::of('core.skills.changed', ['skills' => $keys, 'driver' => $driver->skillProtocol()]);
    }
}
