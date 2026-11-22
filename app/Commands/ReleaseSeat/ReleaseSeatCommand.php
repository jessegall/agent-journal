<?php

declare(strict_types=1);

namespace App\Commands\ReleaseSeat;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\DeskPolicy;
use App\Support\AssignmentReference;
use App\Support\Command;

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
