<?php

declare(strict_types=1);

namespace App\Commands\Terminals\SubmitPrivateInput;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Values\PrivateSubmission;

/**
 * A writer sends a private value once under its single-use submission; the value is never part of the command.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class SubmitPrivateInputCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
        public PrivateSubmission $submission,
    ) {}
}
