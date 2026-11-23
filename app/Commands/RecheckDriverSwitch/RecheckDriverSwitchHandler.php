<?php

declare(strict_types=1);

namespace App\Commands\RecheckDriverSwitch;

use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverSwitchStage;
use App\Models\AgentRuntime;
use App\Models\DriverSwitch;
use App\Models\ProcessStart;

final readonly class RecheckDriverSwitchHandler implements CommandHandler
{
    public function handle(RecheckDriverSwitchCommand $command): void
    {
        $switch = DriverSwitch::lockedById($command->switchId);

        $session = in_array($switch->stage, [DriverSwitchStage::Stopping, DriverSwitchStage::StopUnconfirmed], true)
            ? $switch->expected_session_id
            : $switch->replacement_session_id;

        $start = $session === null ? null : ProcessStart::latestOfSession($session);
        $switch->recheck($start?->state, AgentRuntime::ofSession($switch->expected_session_id));
    }
}
