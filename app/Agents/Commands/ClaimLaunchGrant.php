<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Handlers\ClaimLaunchGrantHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Hands a host the launch credential of one of its Starting runtimes, once. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<string|null>
 */
#[HandledBy(ClaimLaunchGrantHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ClaimLaunchGrant implements Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
    ) {}
}
