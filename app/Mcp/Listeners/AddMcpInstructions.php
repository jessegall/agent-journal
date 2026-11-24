<?php

declare(strict_types=1);

namespace App\Mcp\Listeners;

use App\Contracts\Events\Listener;
use App\Enums\TransportProfileType;
use App\Events\ContextStarted;
use App\Mcp\Support\McpInstructions;
use App\Models\Starts\ProcessStart;

/**
 * Tells an agent how to use the journal's MCP tools, and which of its flowsOutsideMcp stay on the CLI or the web, every time
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
