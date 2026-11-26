<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Api\AddPhasePayload;
use Domain\Plans\Api\PhaseNamed;
use Domain\Plans\Commands\AddPhase\AddPhaseCommand;

/**
 * Adds a phase and answers its id.
 */
final readonly class AddPhaseController
{
    #[Dispatches(AddPhaseCommand::class)]
    public function __invoke(AddPhasePayload $call, CommandBus $commands): PhaseNamed
    {
        return PhaseNamed::from(['phaseId' => $commands->run(new AddPhaseCommand($call->planId, $call->title))]);
    }
}
