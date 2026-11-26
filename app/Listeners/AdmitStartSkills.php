<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Agents\StartDriver;
use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionOpened;
use App\Events\Skills\SessionSkillsIntended;
use App\Exceptions\StartRefused;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\SkillPublications;
use App\Skills\SkillSelection;
use App\Skills\SkillTargets;
use App\Values\DriverKey;

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
        $session = AgentSession::findById($event->sessionId);
        $family = StartDriver::of($session->driver_key, $this->drivers)->driver;

        if ($family === null || ! $this->drivers->hasFamily($family->key)) {
            throw StartRefused::skillsUnsupported((string) $session->driver_key);
        }

        $driver = DriverKey::from($this->drivers->registrationOfFamily($family->key)->skillProtocol);

        if (! $this->adapters->supports($driver)) {
            throw StartRefused::skillsUnsupported((string) $session->driver_key);
        }

        $generation = SkillGeneration::findLatestReady();

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
