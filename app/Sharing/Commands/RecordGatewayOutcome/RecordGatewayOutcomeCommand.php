<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RecordGatewayOutcome;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Support\Gateways\GatewayOperation;
use App\Support\Command;

/**
 * The sharing supervisor's run reports what became of an operation it claimed, under the same endpoint version and
 * lease token; a stale run, another version or an expired lease is refused.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::ShareGateway)]
final readonly class RecordGatewayOutcomeCommand extends Command
{
    public function __construct(
        public string $runId,
        public string $operationId,
        public int $endpointVersion,
        public string $leaseToken,
        public GatewayOutcome $outcome,
    ) {}

    /**
     * What became of the claimed operation, reported under the run, endpoint version and lease it was claimed with.
     */
    public static function of(GatewayOperation $operation, GatewayOutcome $outcome): self
    {
        return new self(
            $operation->runId,
            $operation->operationId,
            $operation->endpointVersion,
            $operation->leaseToken,
            $outcome,
        );
    }
}
