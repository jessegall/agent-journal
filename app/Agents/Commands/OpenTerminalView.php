<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\OpenTerminalViewHandler;
use App\Agents\Models\Agent;
use App\Agents\Models\TerminalView;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\TerminalViewReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * A viewer opens a read-only view of an agent's live terminal: a lease, never a request to the program.
 *
 * @extends Command<TerminalViewReceipt>
 */
#[HandledBy(OpenTerminalViewHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Inspect)]
#[Operation('open_terminal_view', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class OpenTerminalView extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $agentId,
        public int $intervalMs = TerminalView::DEFAULT_INTERVAL_MS,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
