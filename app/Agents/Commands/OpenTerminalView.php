<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\OpenTerminalViewHandler;
use App\Agents\Models\Agent;
use App\Agents\Models\TerminalView;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\TerminalViewReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * A viewer opens a read-only view of an agent's live terminal: a lease, never a request to the program.
 *
 * @extends Command<TerminalViewReceipt>
 */
#[HandledBy(OpenTerminalViewHandler::class)]
#[Operation('open_terminal_view', ResourceAreaType::JournalWork, AccessType::Create)]
#[Authorize(AgentPolicy::class, AgentAbility::Inspect)]
final readonly class OpenTerminalView extends Command implements HasAuthorizationSubject
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
