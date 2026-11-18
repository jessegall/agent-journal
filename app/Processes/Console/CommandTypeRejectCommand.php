<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A project owner rejects a proposal with a reason its author hears; an agent is refused.
 */
#[JournalRoute(JournalRouteType::Write)]
final class CommandTypeRejectCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:reject {proposal : The proposal id} {--reason= : Why it is rejected} {--json}';

    protected $description = 'Reject a proposal';

    public function handle(AgentRequestSender $journal): int
    {
        $path = "/agent/processes/proposals/{$this->argument('proposal')}/reject";

        return $this->sendAndPrint($journal, $path, ['reason' => (string) $this->option('reason')]);
    }
}
