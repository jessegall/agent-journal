<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Agents\StartDriver;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Events\Skills\SessionSkillsIntended;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Enums\SkillReload;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\SkillPublications;
use App\Skills\SkillSelection;
use App\Skills\SkillTargets;
use App\Skills\Values\SelectedSkills;
use App\Stacks\Contracts\Work\AgentStacks;
use App\Stacks\Support\AwaitSkillsStateReference;
use App\Values\AgentText;
use App\Values\DriverKey;

/**
 * At every boundary of a session (start, clear, resume, compaction) selects its skills afresh from today's facts and
 * revisions. A changed selection becomes a pending publication and holds the session's file changes until it is
 * delivered; a driver that loads skills only at a new session is told so. The session's profile and driver stay.
 */
final readonly class RefreshSessionSkills implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private DriverSkillAdapters $adapters,
        private SkillTargets $targets,
        private SkillResolver $skills,
        private AgentStacks $stacks,
        private CommandFacts $facts,
        private SkillPublications $publications,
        private DriverCatalogue $drivers,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $session = AgentSession::findById($event->target->sessionId);
        $driver = StartDriver::of($session->driver_key, $this->drivers)->driver;
        $generation = SkillGeneration::findLatestReady();

        if ($driver === null || ! $this->adapters->supports($driver) || $generation === null) {
            return;
        }

        try {
            $selected = $this->select($session);
        } catch (SkillSelectionConflict $conflict) {
            $notice = AgentText::of('core.skills.not_chosen', ['problem' => $conflict->getMessage()]);
            $event->reminders->add($notice, true);

            return;
        }

        $latest = SkillPublication::findLatestOfSession($session->id);
        $publication = $latest;

        if ($latest === null || $latest->selection_digest !== $selected->digest) {
            $publication = $this->publications->intend(
                $session->id,
                $driver->key,
                $this->targets->targetFor($session->id, $driver),
                $generation,
                $selected->digest,
                $selected->selectedKeys(),
            );
        }

        if ($publication->status->awaitsDelivery()) {
            $this->stacks->push($event->target, AwaitSkillsStateReference::forPublication($publication));
            $this->facts->publishAfterCommit(new SessionSkillsIntended($publication->id));
        }

        $started = SkillPublication::findFirstOfSession($session->id);

        if ($started->selection_digest !== $selected->digest && $this->reloadsAtNewSession($driver)) {
            $event->reminders->add($this->newSessionNotice($driver, $selected), true);
        }
    }

    private function reloadsAtNewSession(DriverKey $driver): bool
    {
        return $this->adapters->for($driver)->reloadMode() === SkillReload::NewSession;
    }

    /**
     * @throws SkillSelectionConflict
     */
    private function select(AgentSession $session): SelectedSkills
    {
        return $this->selection->select(
            $this->skills->all(),
            $this->contexts->forSession($session),
        );
    }

    private function newSessionNotice(DriverKey $driver, SelectedSkills $selected): AgentText
    {
        $keys = $selected->selectedKeys() === [] ? 'none' : implode(', ', $selected->selectedKeys());

        return AgentText::of('core.skills.changed', ['skills' => $keys, 'driver' => $driver->key]);
    }
}
