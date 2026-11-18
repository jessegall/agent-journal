<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner approves one evidence sample of a request's exact line; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderSampleApproveCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'reader:sample-approve {request : The command request id}'
        .' {--expected-revision= : The declaration revision reviewed}'
        .' {--command-digest= : The digest of the exact line} {--json}';

    protected $description = 'Approve one evidence sample of a command request';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/requests/{$this->argument('request')}/sample-approval", [
            'expected_revision' => (int) $this->option('expected-revision'),
            'command_digest' => (string) $this->option('command-digest'),
        ]);
    }
}
