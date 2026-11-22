<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\TerminalDraftChoice;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A writer chooses what becomes of the unsent line in the composer: send it, save and clear it, or drop the
 * journal's waiting work.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class ChooseTerminalDraft extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
        public TerminalDraftChoice $choice,
        public int $sequence,
    ) {}
}
