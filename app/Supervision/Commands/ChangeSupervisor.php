<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\SupervisorTarget;
use App\Supervision\Enums\SupervisorAbility;
use App\Supervision\Handlers\ChangeSupervisorHandler;
use App\Supervision\Models\SupervisorLink;
use App\Supervision\Policies\SupervisorPolicy;
use App\Supervision\Values\SupervisorChangeReceipt;

/** @extends Command<SupervisorChangeReceipt> */
#[HandledBy(ChangeSupervisorHandler::class)]
#[Authorize(SupervisorPolicy::class, SupervisorAbility::ChangeRoute)]
#[Operation('change_supervisor', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ChangeSupervisor extends Command implements AuthorizedCommand
{
    public function __construct(
        public ActorIdentity $actor,
        public SupervisorTarget $target,
        public int $expectedVersion,
        public AskTypeKey|null $type = null,
    ) {}

    /** @return class-string<SupervisorLink> */
    public function subject(): string
    {
        return SupervisorLink::class;
    }
}
