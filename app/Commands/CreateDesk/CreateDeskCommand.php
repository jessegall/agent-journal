<?php

declare(strict_types=1);

namespace App\Commands\CreateDesk;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\DeskPolicy;
use App\Support\Command;

/**
 * Opens an unnamed shared desk with its inbox and its seats; nobody is seated by it.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(DeskPolicy::class, AccessType::Create)]
final readonly class CreateDeskCommand extends Command
{
    public function __construct(
        public string $label,
        public int $seatCount,
        public bool $forwardsOccupants,
    ) {}
}
