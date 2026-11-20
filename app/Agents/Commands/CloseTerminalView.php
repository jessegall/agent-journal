<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\CloseTerminalViewHandler;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A viewer stops watching an agent's terminal; other viewers keep theirs.
 *
 * @extends Command<void>
 */
#[HandledBy(CloseTerminalViewHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class CloseTerminalView extends Command
{
    public function __construct(
        public string $agentId,
    ) {}
}
