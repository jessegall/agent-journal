<?php

declare(strict_types=1);

namespace App\Commands\Agents\NotifyFailure;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Sessions\AccountUseChanged;
use App\Events\Sessions\DriverFailed;
use App\Models\Agents\AgentSession;
use App\Models\Starts\ProcessStart;

final readonly class NotifyFailureHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(NotifyFailureCommand $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);

        if (! $start->stopWithProof()) {
            return;
        }

        $session = AgentSession::query()->findOrFail($start->session_id);
        $driver = $session->selection()->driver;

        $this->facts->publishAfterCommit(new DriverFailed(
            $start->agent_id,
            $start->session_id,
            $driver,
            $command->failure,
            $start->accountIdentity(),
            $start->account_generation,
        ));

        $this->facts->publishAfterCommit(new AccountUseChanged($start->accountIdentity()));
    }
}
