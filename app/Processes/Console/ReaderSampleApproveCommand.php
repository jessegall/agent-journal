<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\ApproveSampleCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner approves one evidence sample of a request's exact line; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderSampleApproveCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'reader:sample-approve {request : The command request id}'
        .' {--expected-revision= : The declaration revision reviewed}'
        .' {--command-digest= : The digest of the exact line}'
        .' {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Approve one evidence sample of a command request';

    public function handle(): int
    {
        return $this->runCall(ApproveSampleCall::from([
            'commandRequest' => (string) $this->argument('request'),
            'expectedRevision' => (int) $this->option('expected-revision'),
            'commandDigest' => (string) $this->option('command-digest'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
