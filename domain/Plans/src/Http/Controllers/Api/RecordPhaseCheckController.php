<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Api\PhaseCheckRecorded;
use Domain\Plans\Api\RecordPhaseCheckPayload;
use Domain\Plans\Commands\RecordPhaseCheck\RecordPhaseCheckCommand;

/**
 * Records a phase check and answers its id.
 */
final readonly class RecordPhaseCheckController
{
    #[Dispatches(RecordPhaseCheckCommand::class)]
    public function __invoke(RecordPhaseCheckPayload $call, CommandBus $commands): PhaseCheckRecorded
    {
        $checkId = $commands->run(new RecordPhaseCheckCommand($call->phaseOfPlan()->id, $call->receipt));

        return PhaseCheckRecorded::from(['checkId' => $checkId]);
    }
}
