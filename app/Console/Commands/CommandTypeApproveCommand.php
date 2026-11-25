<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Processes\ApproveProposalCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner approves a proposal, with the reader revision and proof of a check; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeApproveCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'command-type:approve {proposal : The proposal id} {--expected-revision= : The proposal revision reviewed} {--expected-active-revision=0 : The active rule revision} {--reader-revision= : The proven reader} {--proof= : The reader proof} {--reason=} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Approve a proposal';

    public function handle(): int
    {
        return $this->runCall(ApproveProposalCall::from([
            'proposal' => (string) $this->argument('proposal'),
            'expectedRevision' => (int) $this->option('expected-revision'),
            'expectedActiveRevision' => (int) $this->option('expected-active-revision'),
            'readerRevision' => $this->option('reader-revision'),
            'proof' => $this->option('proof'),
            'reason' => (string) $this->option('reason'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
