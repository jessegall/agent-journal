<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RecordGatewayOutcome;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use Domain\Sharing\Enums\GatewayOutcome;
use Domain\Sharing\Support\Gateways\GatewayOperation;

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
