<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ClaimGatewayOperation;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Support\Command;

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
