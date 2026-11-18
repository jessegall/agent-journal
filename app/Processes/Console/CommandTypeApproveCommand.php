<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner approves a proposal, with the reader revision and proof of a check; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeApproveCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:approve {proposal : The proposal id}'
        .' {--expected-revision= : The proposal revision reviewed}'
        .' {--expected-active-revision=0 : The active rule revision}'
        .' {--reader-revision= : The proven reader} {--proof= : The reader proof} {--reason=} {--json}';

    protected $description = 'Approve a proposal';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/proposals/{$this->argument('proposal')}/approve", [
            'expected_revision' => (int) $this->option('expected-revision'),
            'expected_active_revision' => (int) $this->option('expected-active-revision'),
            'reader_revision' => $this->option('reader-revision'),
            'proof' => $this->option('proof'),
            'reason' => (string) $this->option('reason'),
        ]);
    }
}
