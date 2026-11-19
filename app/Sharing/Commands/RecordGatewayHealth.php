<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Sharing\Handlers\RecordGatewayHealthHandler;

/**
 * The sharing supervisor's run reports whether an endpoint version it holds answered its health check; a stale run is
 * refused, and no share's deadline ever moves.
 *
 * @extends Command<null>
 */
#[HandledBy(RecordGatewayHealthHandler::class)]
#[Entry(CommandEntry::ShareGateway)]
final readonly class RecordGatewayHealth extends Command
{
    public function __construct(
        public string $runId,
        public string $configurationId,
        public int $endpointVersion,
        public bool $healthy,
    ) {}
}
