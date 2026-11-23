<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Events\Listener;
use App\Contracts\Skills\SkillResolver;
use App\Contracts\Work\AgentStack;
use App\Enums\SkillReload;
use App\Events\ContextStarted;
use App\Events\SessionSkillsIntended;
use App\Exceptions\SkillSelectionConflict;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\Drivers\DriverSkillAdapters;
use App\Support\SkillPublications;
use App\Support\SkillSelection;
use App\Support\SkillTargets;
use App\Support\StartDriver;
use App\Support\States\Support\AwaitingSkillsStateReference;
use App\Values\DriverKey;
use App\Values\SelectedSkills;

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
        private AgentStack $stacks,
        private CommandFacts $facts,
        private SkillPublications $publications,
        private DriverCatalogue $drivers,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $session = AgentSession::byId($event->target->sessionId);
        $driver = StartDriver::of($session->driver_key, $this->drivers)->driver;
        $generation = SkillGeneration::latestReady();

        if ($driver === null || ! $this->adapters->supports($driver) || $generation === null) {
            return;
        }

        try {
            $selected = $this->select($session);
        } catch (SkillSelectionConflict $conflict) {
            $event->reminders->add($conflict->getMessage(), true);

            return;
        }

        $latest = SkillPublication::latestOfSession($session->id);
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

        if ($publication->state->awaitsDelivery()) {
            $this->stacks->push($event->target, AwaitingSkillsStateReference::forPublication($publication));
            $this->facts->publishAfterCommit(new SessionSkillsIntended($publication->id));
        }

        $started = SkillPublication::firstOfSession($session->id);

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

    private function newSessionNotice(DriverKey $driver, SelectedSkills $selected): string
    {
        $keys = $selected->selectedKeys() === [] ? 'none' : implode(', ', $selected->selectedKeys());

        return sprintf(
            'Your journal skills changed; they are now: %s. %s loads skills only when a session starts, so start a new session to use the new set; until then read a skill with php artisan skill:show <key>.',
            $keys,
            $driver->key,
        );
    }
}
