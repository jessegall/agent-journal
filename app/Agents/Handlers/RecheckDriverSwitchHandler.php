<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\RecheckDriverSwitch;
use App\Agents\Enums\DriverSwitchStage;
use App\Agents\Models\DriverSwitch;
use App\Agents\Models\ProcessStart;
use App\Contracts\CommandHandler;

final readonly class RecheckDriverSwitchHandler implements CommandHandler
{
    public function handle(RecheckDriverSwitch $command): void
    {
        $switch = DriverSwitch::query()->whereKey($command->switchId)->lockForUpdate()->firstOrFail();

        $session = in_array($switch->stage, [DriverSwitchStage::Stopping, DriverSwitchStage::StopUnconfirmed], true)
            ? $switch->expected_session_id
            : $switch->replacement_session_id;

        $start = $session === null ? null : ProcessStart::latestOfSession($session);
        $switch->recheck($start?->state);
    }
}
