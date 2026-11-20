<?php

declare(strict_types=1);

namespace App\Mcp\Listeners;

use App\Agents\Enums\TransportProfileType;
use App\Agents\Models\ProcessStart;
use App\Contracts\Listener;
use App\Hooks\Events\ContextStarted;
use App\Mcp\Support\McpInstructions;

/**
 * Tells an agent how to use the journal's MCP tools, and which of its journeys stay on the CLI or the web, every time
 * its context starts again; a required reminder, so no budget leaves it out.
 */
final readonly class AddMcpInstructions implements Listener
{
    public function __construct(
        private McpInstructions $instructions,
    ) {}

    public function handle(ContextStarted $event): void
    {
        $start = ProcessStart::latestOfSession($event->target->sessionId);

        if ($start?->transport_profile === TransportProfileType::Cli) {
            return;
        }

        $event->reminders->add($this->instructions->forCaller(), true);
    }
}
