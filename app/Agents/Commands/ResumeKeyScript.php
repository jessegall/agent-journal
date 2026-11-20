<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ResumeKeyScriptHandler;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user lets a key script stopped part way go on from its recorded step; the request's new row version is
 * the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(ResumeKeyScriptHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Execute)]
final readonly class ResumeKeyScript extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
