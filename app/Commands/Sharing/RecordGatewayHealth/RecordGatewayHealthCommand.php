<?php

declare(strict_types=1);

namespace App\Commands\Sharing\RecordGatewayHealth;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * The sharing supervisor's run reports whether an endpoint version it holds answered its health check; a stale run is
 * refused, and no share's deadline ever moves.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::ShareGateway)]
final readonly class RecordGatewayHealthCommand extends Command
{
    public function __construct(
        public string $runId,
        public string $configurationId,
        public int $endpointVersion,
        public bool $isHealthy,
    ) {}
}
