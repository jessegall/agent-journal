<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Desks\Enums\DeskAbility;
use App\Desks\Handlers\CreateDeskHandler;
use App\Desks\Models\DeskRecord;
use App\Desks\Policies\DeskPolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Opens an unnamed shared desk with its inbox and its seats; nobody is seated by it.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(CreateDeskHandler::class)]
#[Authorize(DeskPolicy::class, DeskAbility::Arrange)]
#[Operation('create_desk', ResourceAreaType::JournalControl, AccessType::Create)]
final readonly class CreateDesk extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $label,
        public int $seatCount,
        public bool $forwardsOccupants,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return DeskRecord::class;
    }
}
