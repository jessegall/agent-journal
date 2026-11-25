<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\RejectProposalPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner rejects a proposal with a reason its author is told; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeRejectCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'command-type:reject {proposal : The proposal id} {--reason= : Why it is rejected} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Reject a proposal';

    public function handle(): int
    {
        return $this->runCall(RejectProposalPayload::from([
            'proposal' => (string) $this->argument('proposal'),
            'reason' => (string) $this->option('reason'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
