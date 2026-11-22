<?php

declare(strict_types=1);

namespace App\Profiles\Commands\SwitchAgentDriver;

use App\Agents\Commands\StopAgent\StopAgentCommand;
use App\Agents\Contracts\StartPreflight;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverSwitch;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Drivers\Contracts\DriverCatalogue;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Exceptions\DriverSwitchStale;
use App\Profiles\Values\DriverSwitchReceipt;

final readonly class SwitchAgentDriverHandler implements CommandHandler
{
    public function __construct(
        private ProfileSelections $profiles,
        private StartPreflight $preflight,
        private CommandBus $commands,
        private DriverCatalogue $drivers,
    ) {}

    /**
     * @throws DriverSwitchStale
     */
    public function handle(SwitchAgentDriverCommand $command): DriverSwitchReceipt
    {
        $existing = DriverSwitch::ofRequest($command->requestId);

        if ($existing !== null) {
            return DriverSwitchReceipt::of($existing);
        }

        $agent = Agent::query()->findOrFail($command->agentId);
        $this->assertCurrent($agent, $command);
        $session = AgentSession::query()->findOrFail($command->expectedSessionId);
        // A target its driver cannot run, such as the Codex terminal, is refused with its reason before a switch exists.
        $pin = $this->drivers->pinned($command->target->driver, $command->target->variant);

        $switch = DriverSwitch::create(
            $command->requestId,
            $session,
            $command->expectedGeneration,
            $command->target,
            $pin,
            $command->dispatchedBy()->id,
        );

        $target = $command->target;
        $selection = $this->profiles->select($command->profile, $command->requested, $target->driver, null);
        $refusals = $this->preflight->refusals($selection->proposal($target->variant, $command->requested->model));

        if ($refusals === []) {
            $switch->markPreflighted();
            $switch->beginStopping(AgentRuntime::ofSession($session->id));
            $this->commands->run(new StopAgentCommand($agent->id, $session->id, $command->requestId));
        } else {
            $switch->refuse($refusals[0]->value);
        }

        return DriverSwitchReceipt::of($switch);
    }

    /**
     * @throws DriverSwitchStale
     */
    private function assertCurrent(Agent $agent, SwitchAgentDriverCommand $command): void
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
