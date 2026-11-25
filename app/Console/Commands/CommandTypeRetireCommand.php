<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\RetireRulePayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner retires an active rule at the revision they read; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeRetireCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'command-type:retire {rule : The classification rule id} {--expected-revision= : The active revision read} {--reason= : Why it is retired} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Retire a rule';

    public function handle(): int
    {
        return $this->runCall(RetireRulePayload::from([
            'rule' => (string) $this->argument('rule'),
            'expectedRevision' => (int) $this->option('expected-revision'),
            'reason' => (string) $this->option('reason'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
