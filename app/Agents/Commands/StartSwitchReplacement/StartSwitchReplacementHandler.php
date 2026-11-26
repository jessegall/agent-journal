<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartSwitchReplacement;

use App\Agents\Commands\StartProfileMain\StartProfileMainCommand;
use App\Agents\Drivers\Enums\DriverSwitchStage;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverSwitch;
use App\Values\ProfileKey;

final readonly class StartSwitchReplacementHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(StartSwitchReplacementCommand $command): void
    {
        $switch = DriverSwitch::findLockedById($command->switchId);

        if ($switch->stage !== DriverSwitchStage::Stopped) {
            return;
        }

        $agent = Agent::query()->findOrFail($switch->agent_id);

        $receipt = $this->commands->run(StartProfileMainCommand::toTarget(
            $switch->request_id,
            $agent->id,
            ProfileKey::from($agent->profile_key),
            $switch->target,
        ));

        $switch->beginStarting($receipt->sessionId);
    }
}
