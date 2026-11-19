<?php

declare(strict_types=1);

namespace Domain\Memory\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Memory\Calls\ListMemoriesCall;
use Illuminate\Console\Command;

/**
 * List the memories of the calling agent, asked of the journal over a signed call with the start's token: the
 * start decides whose memory it is, never an option.
 */
#[JournalRoute(JournalRouteType::Read)]
final class MemoryListCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'memory:list {--page=1} {--json}';

    protected $description = 'List the memories of the calling agent';

    public function handle(): int
    {
        return $this->runCall(ListMemoriesCall::from(['page' => (int) $this->option('page')]));
    }
}
