<?php

declare(strict_types=1);

namespace Domain\Memory\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use Domain\Memory\Calls\RemoveMemoryCall;
use Illuminate\Console\Command;

/**
 * Remove a memory of the calling agent, asked of the journal over a signed call with the start's token: the start
 * decides whose memory it is, never an option.
 */
#[JournalRoute(JournalRouteType::Write)]
final class MemoryRemoveCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'memory:remove {memory : The memory id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Remove a memory of the calling agent';

    public function handle(): int
    {
        return $this->runCall(RemoveMemoryCall::from([
            'memoryId' => (string) $this->argument('memory'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
