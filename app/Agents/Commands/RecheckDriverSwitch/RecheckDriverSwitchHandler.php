<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecheckDriverSwitch;

use App\Agents\Drivers\Enums\DriverSwitchStage;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverSwitch;
use App\Models\Sessions\SessionProcess;

final readonly class RecheckDriverSwitchHandler implements CommandHandler
{
    public function handle(RecheckDriverSwitchCommand $command): void
    {
        $switch = DriverSwitch::findLockedById($command->switchId);

        $session = in_array($switch->stage, [DriverSwitchStage::Stopping, DriverSwitchStage::StopUnconfirmed], true)
            ? $switch->expected_session_id
            : $switch->replacement_session_id;

        $start = $session === null ? null : SessionProcess::findLatestOfSession($session);
        $switch->recheck($start?->status, AgentRuntime::findForSession($switch->expected_session_id));
    }
}
