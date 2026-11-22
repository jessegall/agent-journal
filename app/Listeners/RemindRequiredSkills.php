<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Listener;
use App\Enums\PublicationState;
use App\Events\ContextStarted;
use App\Models\AgentSession;
use App\Models\SkillPublication;
use App\Models\SkillReceipt;
use App\Resolvers\Support\SkillContextResolver;

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

        $generation = $publication->generation();
        $freshContext = $event->type->isFreshContext();

        $profile = $this->contexts->forSession($session)->profile;

        foreach ($profile->requiredSkills() as $key) {
            $entry = in_array($key, $publication->skill_keys, true) ? $generation->entry($key) : null;

            if ($entry === null || (! $freshContext && SkillReceipt::hasRead($session->id, $key, $entry['digest']))) {
                continue;
            }

            $event->reminders->add(
                sprintf(
                    'Read the required skill %s whole before work it covers: php artisan skill:show %s, or the skills_show tool.',
                    $key,
                    $key,
                ),
                true,
            );
        }
    }
}
