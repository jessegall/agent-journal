<?php

declare(strict_types=1);

namespace Domain\Memory\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Remove a memory of the calling agent, asked of the journal over a signed call with the launch's token: the launch decides whose memory it
 * is, never an option.
 */
#[JournalRoute(JournalRouteType::Write)]
final class MemoryRemoveCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'memory:remove {memory : The memory id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Remove a memory of the calling agent';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/memory/remove', ['memory_id' => (string) $this->argument('memory')]);
    }
}
