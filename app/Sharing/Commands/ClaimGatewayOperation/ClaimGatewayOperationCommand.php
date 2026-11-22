<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ClaimGatewayOperation;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Sharing\Support\ClaimedGatewayOperation;

/**
 * The sharing supervisor's run claims a gateway operation, the one named or the oldest waiting, under a 90-second
 * lease; a run newer than the holder takes the gateways over first. Null when nothing waits.
 *
 * @extends Command<ClaimedGatewayOperation|null>
 */
#[Entry(CommandEntry::ShareGateway)]
final readonly class ClaimGatewayOperationCommand extends Command
{
    public function __construct(
        public string $runId,
        public string|null $operationId = null,
    ) {}
}
