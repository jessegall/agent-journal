<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Lists the project's proposals, in one state or all.
 */
#[JournalRoute(JournalRouteType::Read)]
final class CommandTypeListCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:list'
        .' {--state= : draft, pending, approved, rejected, withdrawn or superseded} {--json}';

    protected $description = 'List proposals';

    public function handle(AgentRequestSender $journal): int
    {
        $state = array_filter(['state' => (string) $this->option('state')]);

        return $this->sendAndPrint($journal, '/agent/processes/proposals/list', $state);
    }
}
