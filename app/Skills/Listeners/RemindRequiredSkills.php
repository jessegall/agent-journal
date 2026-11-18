<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Agents\Models\AgentSession;
use App\Contracts\Listener;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Skills\Enums\PublicationState;
use App\Skills\Models\SkillPublication;
use App\Skills\Models\SkillReceipt;
use App\Skills\Readers\Support\SkillContextReader;

/**
 * At every boundary, asks the agent to read each required skill of its profile whose delivered text it has not read
 * whole in this context: a changed text is due again, an unchanged one read before is not, and a skill that stopped
 * applying is no longer asked for. A clear or compaction starts a context in which nothing is read yet.
 */
final readonly class RemindRequiredSkills implements Listener
{
    public function __construct(
        private SkillContextReader $contexts,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $session = AgentSession::byId($event->target->sessionId);
        $publication = SkillPublication::latestOfSession($session->id);

        if ($publication === null || $publication->state !== PublicationState::Delivered) {
            return;
        }

        $generation = $publication->generation();
        $freshContext = $event->type === ContextStartType::Clear || $event->type === ContextStartType::Compact;

        foreach ($this->contexts->forSession($session)->profile->requiredSkills() as $key) {
            $entry = in_array($key, $publication->skill_keys, true) ? $generation->entry($key) : null;

            if ($entry === null || (! $freshContext && SkillReceipt::hasRead($session->id, $key, $entry['digest']))) {
                continue;
            }

            $event->reminders->add(
                "Read the required skill {$key} whole before work it covers: php artisan skill:show {$key}, or the "
                .'skills_show tool.',
                true,
            );
        }
    }
}
