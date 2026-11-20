<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Agents\Models\AgentSession;
use App\Contracts\Listener;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Events\ContextStarted;
use App\Programs\Values\ProgramKey;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Enums\SkillReload;
use App\Skills\Events\SessionSkillsIntended;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\States\Support\AwaitingSkillsStateReference;
use App\Skills\Support\SkillSelection;
use App\Skills\Support\SkillTargets;
use App\Skills\Support\StartProgram;
use App\Skills\Values\SelectedSkills;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * At every boundary of a session (start, clear, resume, compaction) selects its skills afresh from today's facts and
 * revisions. A changed selection becomes a pending publication and holds the session's file changes until it is
 * delivered; a program that loads skills only at a new session is told so. The session's profile and program stay.
 */
final readonly class RefreshSessionSkills implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private ProgramSkillAdapters $adapters,
        private SkillTargets $targets,
        private SkillResolver $skills,
        private AgentStack $stacks,
        private Dispatcher $events,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $session = AgentSession::byId($event->target->sessionId);
        $program = StartProgram::of($session->program)->program;
        $generation = SkillGeneration::latestReady();

        if ($program === null || ! $this->adapters->supports($program) || $generation === null) {
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
            $publication = SkillPublication::intend(
                $session->id,
                $program->key,
                $this->targets->targetFor($session->id, $program),
                $generation,
                $selected->digest,
                $selected->selectedKeys(),
            );
        }

        if ($publication->state->awaitsDelivery()) {
            $this->stacks->push($event->target, AwaitingSkillsStateReference::forPublication($publication));
            $this->events->dispatch(new SessionSkillsIntended($publication->id));
        }

        $started = SkillPublication::firstOfSession($session->id);

        if ($started->selection_digest !== $selected->digest && $this->reloadsAtNewSession($program)) {
            $event->reminders->add($this->newSessionNotice($program, $selected), true);
        }
    }

    private function reloadsAtNewSession(ProgramKey $program): bool
    {
        return $this->adapters->for($program)->reloadMode() === SkillReload::NewSession;
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

    private function newSessionNotice(ProgramKey $program, SelectedSkills $selected): string
    {
        $keys = $selected->selectedKeys() === [] ? 'none' : implode(', ', $selected->selectedKeys());

        return sprintf(
            'Your journal skills changed; they are now: %s. %s loads skills only when a session starts, so start a new session to use the new set; until then read a skill with php artisan skill:show <key>.',
            $keys,
            $program->key,
        );
    }
}
