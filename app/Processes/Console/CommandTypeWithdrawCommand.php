<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\WithdrawProposalCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Withdraws the author's proposal; it stays readable.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeWithdrawCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'command-type:withdraw {proposal : The proposal id} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Withdraw a proposal';

    public function handle(): int
    {
        return $this->runCall(WithdrawProposalCall::from([
            'proposal' => (string) $this->argument('proposal'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
