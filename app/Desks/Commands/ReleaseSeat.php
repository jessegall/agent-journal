<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Desks\Enums\DeskAbility;
use App\Desks\Handlers\ReleaseSeatHandler;
use App\Desks\Models\DeskRecord;
use App\Desks\Policies\DeskPolicy;

/**
 * Empties a desk's seat, naming the seat's assignment as it was read.
 *
 * @implements Command<null>
 */
#[HandledBy(ReleaseSeatHandler::class)]
#[Authorize(DeskPolicy::class, DeskAbility::Arrange)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class ReleaseSeat implements Command, HasAuthorizationSubject
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
