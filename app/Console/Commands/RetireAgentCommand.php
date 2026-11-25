<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Agents\RetireAgentCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Retires an agent for good, over a signed call as the main agent of the start, and prints what it released.
 */
#[JournalRoute(JournalRouteType::Write)]
final class RetireAgentCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'agent:retire {agent : The id of the agent to retire} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Retire an agent for good, releasing everything it held';

    public function handle(): int
    {
        return $this->runCall(RetireAgentCall::from([
            'agentId' => (string) $this->argument('agent'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
