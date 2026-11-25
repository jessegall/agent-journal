<?php

declare(strict_types=1);

namespace Domain\Memory\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Memory\Api\RemoveMemoryPayload;
use Illuminate\Console\Command;

/**
 * Remove a memory of the calling agent, asked of the journal over a signed call with the start's token: the start
 * decides whose memory it is, never an option.
 */
#[JournalRoute(JournalRouteType::Write)]
final class MemoryRemoveCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'memory:remove {memory : The memory id} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Remove a memory of the calling agent';

    public function handle(): int
    {
        return $this->runCall(RemoveMemoryPayload::from([
            'memoryId' => (string) $this->argument('memory'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
