<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Agents\Commands\StopAgent;
use App\Agents\Contracts\StartPreflight;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverSwitch;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\SwitchAgentDriver;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Exceptions\DriverSwitchStale;
use App\Profiles\Values\DriverSwitchReceipt;

final readonly class SwitchAgentDriverHandler implements CommandHandler
{
    public function __construct(
        private ProfileSelections $profiles,
        private StartPreflight $preflight,
        private CommandBus $commands,
    ) {}

    /**
     * @throws DriverSwitchStale
     */
    public function handle(SwitchAgentDriver $command): DriverSwitchReceipt
    {
        $existing = DriverSwitch::ofRequest($command->requestId);

        if ($existing !== null) {
            return DriverSwitchReceipt::of($existing);
        }

        $agent = Agent::query()->findOrFail($command->agentId);
        $this->assertCurrent($agent, $command);
        $session = AgentSession::query()->findOrFail($command->expectedSessionId);

        $switch = DriverSwitch::create(
            $command->requestId,
            $session,
            $command->expectedGeneration,
            $command->target,
            $command->dispatchedBy()->id,
        );

        $target = $command->target;
        $selection = $this->profiles->select($command->profile, $command->requested, $target->driver->value, null);
        $refusals = $this->preflight->refusals($selection->proposal($target->variant, $command->requested->model));

        if ($refusals === []) {
            $switch->markPreflighted();
            $switch->beginStopping();
            $this->commands->run(new StopAgent($agent->id, $session->id, $command->requestId));
        } else {
            $switch->refuse($refusals[0]->value);
        }

        return DriverSwitchReceipt::of($switch);
    }

    /**
     * @throws DriverSwitchStale
     */
    private function assertCurrent(Agent $agent, SwitchAgentDriver $command): void
    {
        $runtime = AgentRuntime::ofSession($command->expectedSessionId);
        $generation = $runtime === null ? 0 : $runtime->process_generation;

        $isCurrent = $agent->current_session_id === $command->expectedSessionId
            && $generation === $command->expectedGeneration;

        if (! $isCurrent) {
            throw DriverSwitchStale::forAgent($agent->id, $agent->current_session_id);
        }
    }
}
