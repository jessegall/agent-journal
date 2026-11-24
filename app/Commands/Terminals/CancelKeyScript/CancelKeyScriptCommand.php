<?php

declare(strict_types=1);

namespace App\Commands\Terminals\CancelKeyScript;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A user cancels a key script stopped part way; the request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class CancelKeyScriptCommand extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
