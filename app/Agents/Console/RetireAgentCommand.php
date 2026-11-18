<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

/**
 * Retires an agent for good, over a signed call as the main agent of the launch, and prints what it released.
 */
final class RetireAgentCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'agent:retire {agent : The id of the agent to retire} {--json}';

    protected $description = 'Retire an agent for good, releasing everything it held';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/agents/retire', ['agentId' => (string) $this->argument('agent')]);
    }
}
