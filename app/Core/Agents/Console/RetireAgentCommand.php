<?php

declare(strict_types=1);

namespace App\Core\Agents\Console;

use App\Core\Agents\Console\Concerns\SendsSignedCalls;
use App\Core\Agents\Contracts\AgentRequestSender;
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
        return $this->sendAndPrint($journal, '/agent/agents/retire', ['agentId' => (int) $this->argument('agent')]);
    }
}
