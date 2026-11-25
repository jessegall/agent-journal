<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Enums\Skills\PublicationState;
use App\Events\Hooks\ContextStarted;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Models\Skills\SkillReceipt;
use App\Resolvers\Support\SkillContextResolver;
use App\Values\AgentText;

/**
 * At every boundary, asks the agent to read each required skill of its profile whose delivered text it has not read
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
        $session = AgentSession::byId($event->target->sessionId);
        $publication = SkillPublication::latestOfSession($session->id);

        if ($publication === null || $publication->state !== PublicationState::Delivered) {
            return;
        }

        $generation = SkillGeneration::findForPublication($publication);
        $freshContext = $event->type->isFreshContext();

        $profile = $this->contexts->forSession($session)->profile;

        foreach ($profile->requiredSkills() as $key) {
            $entry = in_array($key, $publication->skill_keys, true) ? $generation->entry($key) : null;

            if ($entry === null || (! $freshContext && SkillReceipt::hasRead($session->id, $key, $entry->digest))) {
                continue;
            }

            $event->reminders->add(AgentText::of('core.skills.read_required', ['skill' => $key]), true);
        }
    }
}
