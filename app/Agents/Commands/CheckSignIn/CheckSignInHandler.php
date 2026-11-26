<?php

declare(strict_types=1);

namespace App\Agents\Commands\CheckSignIn;

use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Bus\Contracts\CommandHandler;
use App\Models\Hosts\HostProcess;
use App\Sessions\Enums\StartRefusalReason;
use App\Sessions\StartHeartbeats;
use App\Time\Contracts\ServerClock;

final readonly class CheckSignInHandler implements CommandHandler
{
    public function __construct(
        private DriverProfiles $profiles,
        private StartHeartbeats $heartbeats,
        private ServerClock $clock,
        private HeadlessStarts $headless,
    ) {}

    public function handle(CheckSignInCommand $command): void
    {
        $process = HostProcess::query()->with('runtime')->whereKey($command->processId)->sole();
        $start = $process->sessionProcess()->lockForUpdate()->sole();
        $runtime = $process->runtime;

        if (! $this->profiles->of($runtime)->hasAcceptedSignIn($command->printed, $start->directory)) {
            $this->heartbeats->refuseStart($start, StartRefusalReason::NotSignedIn->explanation());

            return;
        }

        $runtime->proveStart($this->clock->now());
        $this->headless->openProven($runtime);
    }
}
