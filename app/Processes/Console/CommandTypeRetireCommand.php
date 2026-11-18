<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner retires an active rule at the revision they read; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeRetireCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:retire {rule : The classification rule id}'
        .' {--expected-revision= : The active revision read} {--reason= : Why it is retired} {--json}';

    protected $description = 'Retire a rule';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/rules/{$this->argument('rule')}/retire", [
            'expected_revision' => (int) $this->option('expected-revision'),
            'reason' => (string) $this->option('reason'),
        ]);
    }
}
