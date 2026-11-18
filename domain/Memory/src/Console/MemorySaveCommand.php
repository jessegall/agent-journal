<?php

declare(strict_types=1);

namespace Domain\Memory\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Keep a memory of the calling agent, asked of the journal over a signed call with the launch's token: the launch decides whose memory it
 * is, never an option.
 */
#[JournalRoute(JournalRouteType::Write)]
final class MemorySaveCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'memory:save {text : What to do and when} {--weight=5 : 1 to 10} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Keep a memory of the calling agent';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/memory/save', ['text' => (string) $this->argument('text'), 'weight' => (int) $this->option('weight')]);
    }
}
