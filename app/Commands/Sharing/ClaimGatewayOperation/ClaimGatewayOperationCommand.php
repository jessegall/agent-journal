<?php

declare(strict_types=1);

namespace App\Commands\Sharing\ClaimGatewayOperation;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\ClaimedGatewayOperation;
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
