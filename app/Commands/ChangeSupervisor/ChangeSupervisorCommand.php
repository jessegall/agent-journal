<?php

declare(strict_types=1);

namespace App\Commands\ChangeSupervisor;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\SupervisorPolicy;
use App\Support\ActorIdentity;
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
        public ActorIdentity $actor,
        public SupervisorTarget $target,
        public int $expectedVersion,
        public AskTypeKey|null $type = null,
    ) {}
}
