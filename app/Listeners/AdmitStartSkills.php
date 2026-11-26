<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Agents\StartDriver;
use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionOpened;
use App\Exceptions\StartRefused;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\SkillSelection;
use App\Values\DriverKey;

/**
 * Admits a start's skills inside its transaction: a driver the journal cannot hand skills to is refused, a required
 * skill outside the selection refuses the start with its key, and the selected keys the generation holds are recorded
 * with the session. Before the first skill:refresh there is no generation, and nothing is recorded.
 */
#[InCommandTransaction]
final readonly class AdmitStartSkills implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private DriverSkillAdapters $adapters,
        private SkillResolver $skills,
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

        $handed = array_values(array_filter(
            $selected->selectedKeys(),
            fn (string $key) => $generation->entry($key) !== null,
        ));

        $session->recordSkills($generation, $handed);
    }
}
