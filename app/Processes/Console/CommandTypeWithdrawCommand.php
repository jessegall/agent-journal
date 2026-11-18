<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Withdraws the author's proposal; it stays readable.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeWithdrawCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:withdraw {proposal : The proposal id} {--json}';

    protected $description = 'Withdraw a proposal';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/proposals/{$this->argument('proposal')}/withdraw", []);
    }
}
