<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Data\TerminalControlData;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Values\PrivateSubmission;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A writer sends a private value once under its single-use submission; the value is never part of the command.
 *
 * @extends Command<TerminalControlData>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class SubmitPrivateInput extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
        public PrivateSubmission $submission,
    ) {}
}
