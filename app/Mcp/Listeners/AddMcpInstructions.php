<?php

declare(strict_types=1);

namespace App\Mcp\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Mcp\Support\McpInstructions;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Enums\TransportProfileType;

/**
 * Tells an agent how to use the journal's MCP tools, and which of its flows stay on the CLI or the web, every time
 * its context starts again; a required reminder, so no budget leaves it out.
 */
final readonly class AddMcpInstructions implements Listener
{
    public function __construct(
        private McpInstructions $instructions,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $start = SessionProcess::findLatestOfSession($event->target->sessionId);

        if ($start?->transport_profile === TransportProfileType::Cli) {
            return;
        }

        $event->reminders->add($this->instructions->forCaller(), true);
    }
}
