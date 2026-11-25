<?php

declare(strict_types=1);

namespace App\Commands\Agents\ChangeSupervisor;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\SupervisorPolicy;
use App\Support\ActorReference;
use App\Support\Command;
use App\Values\AskTypeKey;
use App\Values\SupervisorChangeReceipt;
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
