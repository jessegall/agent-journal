<?php

declare(strict_types=1);

namespace App\Commands\Terminals\ResumeKeyScript;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A user lets a key script stopped part way go on from its recorded step; the request's new row version is
 * the answer.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Execute)]
final readonly class ResumeKeyScriptCommand extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
