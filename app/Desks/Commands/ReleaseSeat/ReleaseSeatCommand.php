<?php

declare(strict_types=1);

namespace App\Desks\Commands\ReleaseSeat;

use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Desks\Policies\DeskPolicy;
use App\Operations\Enums\AccessType;

/**
 * Empties a desk's seat, naming the seat's assignment as it was read.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(DeskPolicy::class, AccessType::Edit)]
final readonly class ReleaseSeatCommand extends Command
{
    public function __construct(
        public string $deskId,
        public string $seatId,
        public AssignmentReference $expected,
    ) {}
}
