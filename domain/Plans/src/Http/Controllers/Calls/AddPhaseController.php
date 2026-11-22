<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Calls\AddPhaseCall;
use Domain\Plans\Calls\PhaseNamed;
use Domain\Plans\Commands\AddPhase\AddPhaseCommand;

/**
 * Adds a phase and answers its id.
 */
final readonly class AddPhaseController
{
    public function __invoke(AddPhaseCall $call, CommandBus $commands): PhaseNamed
    {
        return PhaseNamed::from(['phaseId' => $commands->run(new AddPhaseCommand($call->planId, $call->title))]);
    }
}
