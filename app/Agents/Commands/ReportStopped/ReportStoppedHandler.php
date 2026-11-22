<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReportStopped;

use App\Agents\Events\AccountUseChanged;
use App\Agents\Models\DriverSwitch;
use App\Agents\Models\ProcessStart;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;

final readonly class ReportStoppedHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(ReportStoppedCommand $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);

        if ($start->stopWithProof()) {
            $this->facts->publishAfterCommit(new AccountUseChanged($start->accountIdentity()));
            DriverSwitch::stoppingOf($start->session_id)?->markStopped();
        }
    }
}
