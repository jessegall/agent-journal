<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Hooks\Enums\ContextStartType;
use App\Models\Agents\AgentSession;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\SkillReadAsks;

/**
 * At a start, a clear and a compaction, asks the agent to read each skill its profile requires that its start handed
 * it, in the profile's order. A resume keeps the context and the stack, so it asks nothing; a session handed no
 * skills asks nothing either.
 */
final readonly class AskRequiredSkillReads implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private SkillReadAsks $asks,
    ) {}

    public function handle(ContextStarted $event): void
    {
        if ($event->type === ContextStartType::Resume) {
            return;
        }

        $session = AgentSession::findById($event->target->sessionId);

        if ($session->skill_generation_id === null) {
            return;
        }

        $profile = $this->contexts->forSession($session)->profile;

        $this->asks->ask($event->target, $session->requiredSkillKeys($profile));
    }
}
