<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReportFailure;

use App\Agents\Events\AccountUseChanged;
use App\Agents\Events\DriverFailed;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;

final readonly class ReportFailureHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(ReportFailureCommand $command): void
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
