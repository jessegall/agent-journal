<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Models\TerminalView;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\TerminalViewReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A viewer opens a read-only view of an agent's live terminal: a lease, never a request to the driver.
 *
 * @extends Command<TerminalViewReceipt>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Create)]
final readonly class OpenTerminalView extends Command
{
    public function __construct(
        public string $agentId,
        public int $intervalMs = TerminalView::DEFAULT_INTERVAL_MS,
    ) {}
}
