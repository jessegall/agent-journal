<?php

declare(strict_types=1);

namespace App\Commands\Agents\StartSwitchReplacement;

use App\Commands\Agents\StartProfileMain\StartProfileMainCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverSwitchStage;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverSwitch;
use App\Values\ProfileKey;

final readonly class StartSwitchReplacementHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(StartSwitchReplacementCommand $command): void
    {
        $switch = DriverSwitch::lockedById($command->switchId);

        if ($switch->stage !== DriverSwitchStage::Stopped) {
            return;
        }

        $agent = Agent::query()->findOrFail($switch->agent_id);

        $receipt = $this->commands->run(StartProfileMainCommand::toTarget(
            $switch->request_id,
            $agent->id,
            ProfileKey::from($agent->profile_key),
            $switch->target(),
        ));

        $switch->beginStarting($receipt->sessionId);
    }
}
