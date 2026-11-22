<?php

declare(strict_types=1);

namespace App\Profiles\Commands\StartSwitchReplacement;

use App\Agents\Enums\DriverSwitchStage;
use App\Agents\Models\Agent;
use App\Agents\Models\DriverSwitch;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\StartProfileMain\StartProfileMainCommand;
use App\Profiles\Values\ProfileKey;

final readonly class StartSwitchReplacementHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(StartSwitchReplacementCommand $command): void
    {
        $switch = DriverSwitch::query()->whereKey($command->switchId)->lockForUpdate()->firstOrFail();

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
