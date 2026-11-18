<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\ClaimGatewayOperationHandler;
use App\Sharing\Support\ClaimedGatewayOperation;

/**
 * The sharing supervisor's run claims a gateway operation, the one named or the oldest waiting, under a 90-second
 * lease; a run newer than the holder takes the gateways over first. Null when nothing waits.
 *
 * @implements Command<ClaimedGatewayOperation|null>
 */
#[HandledBy(ClaimGatewayOperationHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ClaimGatewayOperation implements Command
{
    public function __construct(
        public string $runId,
        public string|null $operationId = null,
    ) {}
}
