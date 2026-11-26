<?php

declare(strict_types=1);

namespace App\Terminals\Commands\ChooseTerminalDraft;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Terminals\Enums\TerminalDraftChoice;

/**
 * A writer chooses what becomes of the unsent line in the composer: send it, save and clear it, or drop the
 * journal's waiting work.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class ChooseTerminalDraftCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
        public TerminalDraftChoice $choice,
        public int $sequence,
    ) {}
}
