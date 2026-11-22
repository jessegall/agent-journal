<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Processes\RestoreRuleCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner restores an earlier revision of a rule as a new proposal that still needs approval.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeRestoreCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'command-type:restore {rule : The classification rule id} {--from-revision= : The earlier revision} {--expected-revision= : The active revision read} {--request-key= : The key that makes a retry the same proposal} {--json}';

    protected $description = 'Restore an earlier revision of a rule';

    public function handle(): int
    {
        return $this->runCall(RestoreRuleCall::from([
            'rule' => (string) $this->argument('rule'),
            'fromRevision' => (int) $this->option('from-revision'),
            'expectedRevision' => (int) $this->option('expected-revision'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
