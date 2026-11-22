<?php

declare(strict_types=1);

namespace App\Supervision\Commands\ChangeSupervisor;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\SupervisorTarget;
use App\Supervision\Policies\SupervisorPolicy;
use App\Supervision\Values\SupervisorChangeReceipt;

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
