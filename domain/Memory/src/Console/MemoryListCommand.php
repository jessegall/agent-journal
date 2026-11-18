<?php

declare(strict_types=1);

namespace Domain\Memory\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * List the memories of the calling agent, asked of the journal over a signed call with the launch's token: the launch decides whose memory it
 * is, never an option.
 */
#[JournalRoute(JournalRouteType::Read)]
final class MemoryListCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'memory:list {--page=1} {--json}';

    protected $description = 'List the memories of the calling agent';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/memory/list', ['page' => (int) $this->option('page')]);
    }
}
