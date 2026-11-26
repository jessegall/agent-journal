<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\WithdrawProposalPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

/**
 * Withdraws the author's proposal; it stays readable.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeWithdrawCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'command-type:withdraw {proposal : The proposal id} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Withdraw a proposal';

    public function handle(): int
    {
        return $this->runCall(WithdrawProposalPayload::from([
            'proposal' => (string) $this->argument('proposal'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
