<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChangeSupervisor;

use App\Agents\Enums\AccessType;
use App\Agents\Values\SupervisorChangeReceipt;
use App\Attributes\Commands\Authorize;
use App\Policies\SupervisorPolicy;
use App\Support\ActorReference;
use App\Support\Command;
use App\Values\AskTypeKey;
use App\Values\SupervisorTarget;

/**
 * @extends Command<SupervisorChangeReceipt>
 */
#[Authorize(SupervisorPolicy::class, AccessType::Edit)]
final readonly class ChangeSupervisorCommand extends Command
{
    public function __construct(
        public ActorReference $actor,
        public SupervisorTarget $target,
        public int $expectedVersion,
        public AskTypeKey|null $type = null,
    ) {}
}
