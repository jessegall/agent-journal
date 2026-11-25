<?php

declare(strict_types=1);

namespace App\Commands\Agents\RecheckDriverSwitch;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Drivers\DriverSwitchStage;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverSwitch;
use App\Models\Sessions\SessionProcess;

final readonly class RecheckDriverSwitchHandler implements CommandHandler
{
    public function handle(RecheckDriverSwitchCommand $command): void
    {
        $switch = DriverSwitch::lockedById($command->switchId);

        $session = in_array($switch->stage, [
            DriverSwitchStage::Stopping,
            DriverSwitchStage::StopUnconfirmed,
        ], true)
            ? $switch->expected_session_id
            : $switch->replacement_session_id;

        $start = $session === null ? null : SessionProcess::latestOfSession($session);
        $switch->recheck($start?->state, AgentRuntime::ofSession($switch->expected_session_id));
    }
}
