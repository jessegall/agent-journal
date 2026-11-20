<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Desks\Enums\DeskAbility;
use App\Desks\Handlers\ReleaseSeatHandler;
use App\Desks\Models\DeskRecord;
use App\Desks\Policies\DeskPolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Empties a desk's seat, naming the seat's assignment as it was read.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(ReleaseSeatHandler::class)]
#[Authorize(DeskPolicy::class, DeskAbility::Arrange)]
#[Operation('release_seat', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class ReleaseSeat extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $deskId,
        public string $seatId,
        public AssignmentReference $expected,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return DeskRecord::class;
    }
}
