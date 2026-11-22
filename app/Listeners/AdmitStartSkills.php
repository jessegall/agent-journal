<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\CommandFacts;
use App\Contracts\DriverCatalogue;
use App\Contracts\Listener;
use App\Contracts\SkillResolver;
use App\Events\SessionOpened;
use App\Events\SessionSkillsIntended;
use App\Exceptions\StartRefused;
use App\Models\AgentSession;
use App\Models\SkillGeneration;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\Drivers\DriverSkillAdapters;
use App\Support\SkillPublications;
use App\Support\SkillSelection;
use App\Support\SkillTargets;
use App\Support\StartDriver;

/**
 * Admits a start's skills inside its transaction: a driver the journal cannot hand skills to is refused, a required
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
        private DriverCatalogue $drivers,
    ) {}

    public function handle(SessionOpened $event): void
    {
        $session = AgentSession::byId($event->sessionId);
        $driver = StartDriver::of($session->driver_key, $this->drivers)->driver;

        if ($driver === null || ! $this->adapters->supports($driver)) {
            throw StartRefused::skillsUnsupported((string) $session->driver_key);
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
