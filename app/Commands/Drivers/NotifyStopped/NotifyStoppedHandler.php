<?php

declare(strict_types=1);

namespace App\Commands\Drivers\NotifyStopped;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Sessions\AccountUseChanged;
use App\Events\Sessions\SessionStateChanged;
use App\Models\Drivers\DriverSwitch;
use App\Models\Starts\ProcessStart;

final readonly class NotifyStoppedHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(NotifyStoppedCommand $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);

        if ($start->stopWithProof()) {
            $this->facts->publishAfterCommit(new AccountUseChanged($start->accountIdentity));
            $this->facts->publishAfterCommit(new SessionStateChanged($start->session_id));
            DriverSwitch::stoppingOf($start->session_id)?->markStopped();
        }
    }
}
