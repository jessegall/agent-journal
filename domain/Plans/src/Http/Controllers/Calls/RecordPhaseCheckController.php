<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Contracts\CommandBus;
use Domain\Plans\Calls\PhaseCheckRecorded;
use Domain\Plans\Calls\RecordPhaseCheckCall;
use Domain\Plans\Commands\RecordPhaseCheck\RecordPhaseCheckCommand;

/**
 * Records a phase check and answers its id.
 */
final readonly class RecordPhaseCheckController
{
    public function __invoke(RecordPhaseCheckCall $call, CommandBus $commands): PhaseCheckRecorded
    {
        $checkId = $commands->run(new RecordPhaseCheckCommand($call->phaseOfPlan()->id, $call->receipt));

        return PhaseCheckRecorded::from(['checkId' => $checkId]);
    }
}
