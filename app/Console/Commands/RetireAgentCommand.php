<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Agents\RetireAgentPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Retires an agent for good, over a signed call as the main agent of the start, and prints what it released.
 */
#[JournalRoute(JournalRouteType::Write)]
final class RetireAgentCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'agent:retire {agent : The id of the agent to retire} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Retire an agent for good, releasing everything it held';

    public function handle(): int
    {
        return $this->runCall(RetireAgentPayload::from([
            'agentId' => (string) $this->argument('agent'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
