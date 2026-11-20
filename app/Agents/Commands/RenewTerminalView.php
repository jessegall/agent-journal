<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RenewTerminalViewHandler;
use App\Agents\Models\TerminalView;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\TerminalViewReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A viewer keeps watching an agent's terminal: the lease goes on, or a lapsed one opens anew.
 *
 * @extends Command<TerminalViewReceipt>
 */
#[HandledBy(RenewTerminalViewHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RenewTerminalView extends Command
{
    public function __construct(
        public string $agentId,
        public int $intervalMs = TerminalView::DEFAULT_INTERVAL_MS,
    ) {}
}
