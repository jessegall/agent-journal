<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\CancelKeyScriptHandler;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user cancels a key script stopped part way; the request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(CancelKeyScriptHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class CancelKeyScript extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
