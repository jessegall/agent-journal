<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillReceipt;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Values\AgentText;

/**
 * At every boundary, asks the agent to read each required skill of its profile whose handed text it has not read
 * whole in this context: a changed text is due again, an unchanged one read before is not, and a skill that stopped
 * applying is no longer asked for. A clear or compaction starts a context in which nothing is read yet.
 */
final readonly class RemindRequiredSkills implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $session = AgentSession::findById($event->target->sessionId);
        $generationId = $session->skill_generation_id;

        if ($generationId === null) {
            return;
        }

        $generation = SkillGeneration::findById($generationId);
        $freshContext = $event->type->isFreshContext();

        $profile = $this->contexts->forSession($session)->profile;

        foreach ($profile->requiredSkills() as $key) {
            $entry = $session->hasSkill($key) ? $generation->entry($key) : null;

            if ($entry === null || (! $freshContext && SkillReceipt::hasRead($session->id, $key, $entry->digest))) {
                continue;
            }

            $event->reminders->add(AgentText::of('core.skills.read_required', ['skill' => $key]), true);
        }
    }
}
