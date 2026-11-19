<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Agents\Events\LaunchStarted;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Models\AgentSession;
use App\Contracts\Listener;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Events\SessionSkillsIntended;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\LaunchProgram;
use App\Skills\Support\SkillSelection;
use App\Skills\Support\SkillTargets;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Admits a launch's skills inside its transaction: a program the journal cannot hand skills to is refused, a required
 * skill outside the selection refuses the launch with its key, and the selected set is saved as a pending publication
 * that is written once the launch committed. Before the first skill:refresh there is no generation to publish.
 */
final readonly class AdmitLaunchSkills implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private ProgramSkillAdapters $adapters,
        private SkillTargets $targets,
        private Container $container,
        private Dispatcher $events,
    ) {}

    public function handle(LaunchStarted $event): void
    {
        $session = AgentSession::byId($event->sessionId);
        $program = LaunchProgram::of($session->program)->program;

        if ($program === null || ! $this->adapters->supports($program)) {
            throw LaunchRefused::skillsUnsupported((string) $session->program);
        }

        $generation = SkillGeneration::latestReady();

        if ($generation === null) {
            return;
        }

        $context = $this->contexts->forSession($session);
        $selected = $this->selection->select($this->container->make(SkillResolver::class)->all(), $context);
        $publication = SkillPublication::intend(
            $session->id,
            $program->key,
            $this->targets->targetFor($session->id, $program),
            $generation,
            $selected->digest,
            $selected->selectedKeys(),
        );

        $this->events->dispatch(new SessionSkillsIntended($publication->id));
    }
}
