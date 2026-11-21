<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Agents\Events\SessionOpened;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Models\AgentSession;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Drivers\DriverSkillAdapters;
use App\Skills\Events\SessionSkillsIntended;
use App\Skills\Models\SkillGeneration;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\SkillPublications;
use App\Skills\Support\SkillSelection;
use App\Skills\Support\SkillTargets;
use App\Skills\Support\StartDriver;

/**
 * Admits a start's skills inside its transaction: a program the journal cannot hand skills to is refused, a required
 * skill outside the selection refuses the start with its key, and the selected set is saved as a pending publication
 * that is written once the start committed. Before the first skill:refresh there is no generation to publish.
 */
#[InCommandTransaction]
final readonly class AdmitStartSkills implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private DriverSkillAdapters $adapters,
        private SkillTargets $targets,
        private SkillResolver $skills,
        private CommandFacts $facts,
        private SkillPublications $publications,
    ) {}

    public function handle(SessionOpened $event): void
    {
        $session = AgentSession::byId($event->sessionId);
        $driver = StartDriver::of($session->driver)->driver;

        if ($driver === null || ! $this->adapters->supports($driver)) {
            throw StartRefused::skillsUnsupported((string) $session->driver);
        }

        $generation = SkillGeneration::latestReady();

        if ($generation === null) {
            return;
        }

        $context = $this->contexts->forSession($session);
        $selected = $this->selection->select($this->skills->all(), $context);

        $publication = $this->publications->intend(
            $session->id,
            $driver->key,
            $this->targets->targetFor($session->id, $driver),
            $generation,
            $selected->digest,
            $selected->selectedKeys(),
        );

        $this->facts->publishAfterCommit(new SessionSkillsIntended($publication->id));
    }
}
