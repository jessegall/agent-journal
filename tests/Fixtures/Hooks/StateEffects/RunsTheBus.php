<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateEffects;

use App\Bus\Contracts\CommandBus as Runner;
use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;

/**
 * A state that runs a command itself through an aliased import, which the state effects check refuses.
 */
final class RunsTheBus extends AgentState
{
    public function __construct(private readonly Runner $runner) {}

    public function onStop(StopRequested $input): Decision
    {
        $command = new FocusInstruction();

        $this->runner->run($command);

        return Decision::allow();
    }
}
