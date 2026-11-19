<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportFailure;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Events\ProgramFailed;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ReportFailureHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(ReportFailure $command): void
    {
        $start = ProcessStart::claimedBy($command->hostId, $command->startKey);

        if (! $start->stopWithProof()) {
            return;
        }

        $session = AgentSession::query()->findOrFail($start->session_id);
        $program = $session->selection()->program->value;
        $this->events->dispatch(new ProgramFailed($start->agent_id, $start->session_id, $program, $command->failure));
        $this->events->dispatch(new AccountUseChanged($start->accountIdentity()));
    }
}
