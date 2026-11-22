<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenTerminalView;

use App\Agents\Models\TerminalView;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A viewer opens a read-only view of an agent's live terminal: a new read interest of its own, a lease, never a request
 * to the driver. A retry with the same open request gives the interest it opened first.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Create)]
final readonly class OpenTerminalViewCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $openRequestId,
        public int $intervalMs = TerminalView::DEFAULT_INTERVAL_MS,
    ) {}
}
