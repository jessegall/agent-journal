<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner restores an earlier revision of a rule as a new proposal that still needs approval.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeRestoreCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:restore {rule : The classification rule id}'
        .' {--from-revision= : The earlier revision} {--expected-revision= : The active revision read}'
        .' {--request-id= : The id that makes a retry the same proposal} {--json}';

    protected $description = 'Restore an earlier revision of a rule';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/rules/{$this->argument('rule')}/restore", [
            'from_revision' => (int) $this->option('from-revision'),
            'expected_revision' => (int) $this->option('expected-revision'),
            'request_id' => (string) $this->option('request-id'),
        ]);
    }
}
