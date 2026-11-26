<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\NotifyStopped;

use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\AccountUseChanged;
use App\Events\Sessions\SessionStateChanged;
use App\Models\Drivers\DriverSwitch;
use App\Models\Sessions\SessionProcess;

final readonly class NotifyStoppedHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(NotifyStoppedCommand $command): void
    {
        $start = SessionProcess::findClaimedBy($command->hostId, $command->startKey);

        if ($start->stopWithProof()) {
            $this->facts->publishAfterCommit(new AccountUseChanged($start->accountIdentity));
            $this->facts->publishAfterCommit(new SessionStateChanged($start->session_id));
            $stoppingSwitch = DriverSwitch::findStoppingOf($start->session_id);

            if ($stoppingSwitch !== null) {
                $stoppingSwitch->markStopped();
            }
        }
    }
}
