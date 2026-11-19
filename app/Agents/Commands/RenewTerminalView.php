<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\RenewTerminalViewHandler;
use App\Agents\Models\Agent;
use App\Agents\Models\TerminalView;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\TerminalViewReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * A viewer keeps watching an agent's terminal: the lease goes on, or a lapsed one opens anew.
 *
 * @extends Command<TerminalViewReceipt>
 */
#[HandledBy(RenewTerminalViewHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Inspect)]
final readonly class RenewTerminalView extends Command implements HasAuthorizationSubject
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
