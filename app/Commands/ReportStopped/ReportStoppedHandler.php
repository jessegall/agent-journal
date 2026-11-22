<?php

declare(strict_types=1);

namespace App\Commands\ReportStopped;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\AccountUseChanged;
use App\Models\DriverSwitch;
use App\Models\ProcessStart;

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
