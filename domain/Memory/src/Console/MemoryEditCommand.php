<?php

declare(strict_types=1);

namespace Domain\Memory\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Change the text or weight of a memory of the calling agent, asked of the journal over a signed call with the launch's token: the launch decides whose memory it
 * is, never an option.
 */
#[JournalRoute(JournalRouteType::Write)]
final class MemoryEditCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'memory:edit {memory : The memory id} {--revision= : The revision you read, from memory:list} {--text= : The new text} {--weight= : The new weight, 1 to 10} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Change the text or weight of a memory of the calling agent';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/memory/edit', array_filter(['memory_id' => (string) $this->argument('memory'), 'revision' => (int) $this->option('revision'), 'text' => $this->option('text'), 'weight' => $this->option('weight') === null ? null : (int) $this->option('weight')], fn ($value) => $value !== null));
    }
}
