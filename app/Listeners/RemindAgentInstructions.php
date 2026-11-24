<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Messages\ReadMessage\ReadMessageCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Mcp\Support\McpCatalogue;
use App\Models\Agents\AgentSession;
use App\Resolvers\Support\SkillContextResolver;
use App\Values\AgentText;

/**
 * Tells an agent how it works with the journal, and its profile's own instructions, each time its context starts:
 * at its start, a clear, a resume and a compaction. A session reads the profile revision it started on, so an edit
 * to the profile reaches the agent's next session.
 */
final readonly class RemindAgentInstructions implements Listener
{
    public function __construct(
        private SkillContextResolver $contexts,
        private McpCatalogue $tools,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $event->reminders->add(AgentText::of('core.instructions.prelude', [
            'read' => $this->tools->toolNameDispatching(ReadMessageCommand::class),
            'send' => $this->tools->toolNameDispatching(SendMessageCommand::class),
        ]), true);

        $profile = $this->contexts->forSession(AgentSession::byId($event->target->sessionId))->profile;

        if ($profile->snapshot === null || trim($profile->snapshot->instructions) === '') {
            return;
        }

        $event->reminders->add(
            AgentText::of('core.instructions.profile', ['instructions' => $profile->snapshot->instructions]),
            true,
        );
    }
}
