<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\RecordGatewayHealthHandler;

/**
 * The sharing supervisor's run reports whether an endpoint version it holds answered its health check; a stale run is
 * refused, and no share's deadline ever moves.
 *
 * @implements Command<null>
 */
#[HandledBy(RecordGatewayHealthHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class RecordGatewayHealth implements Command
{
    public function __construct(
        public string $runId,
        public string $configurationId,
        public int $endpointVersion,
        public bool $healthy,
    ) {}
}
