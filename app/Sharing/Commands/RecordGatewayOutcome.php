<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Handlers\RecordGatewayOutcomeHandler;

/**
 * The sharing supervisor's run reports what became of an operation it claimed, under the same endpoint version and
 * lease token; a stale run, another version or an expired lease is refused.
 *
 * @implements Command<null>
 */
#[HandledBy(RecordGatewayOutcomeHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class RecordGatewayOutcome implements Command
{
    public function __construct(
        public string $runId,
        public string $operationId,
        public int $endpointVersion,
        public string $leaseToken,
        public GatewayOutcome $outcome,
    ) {}
}
