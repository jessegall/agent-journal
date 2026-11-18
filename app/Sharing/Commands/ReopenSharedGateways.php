<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\ReopenSharedGatewaysHandler;

/**
 * A sharing supervisor run that just started takes the gateways over and asks to open again the endpoint of every
 * configuration that still serves a live, unexpired share; it answers how many opens it requested.
 *
 * @implements Command<int>
 */
#[HandledBy(ReopenSharedGatewaysHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ReopenSharedGateways implements Command
{
    public function __construct(public string $runId) {}
}
