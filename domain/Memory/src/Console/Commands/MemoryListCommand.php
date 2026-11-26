<?php

declare(strict_types=1);

namespace Domain\Memory\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Domain\Memory\Api\ListMemoriesPayload;
use Illuminate\Console\Command;

/**
 * List the memories of the calling agent, asked of the journal over a signed call with the start's token: the
 * start decides whose memory it is, never an option.
 */
#[JournalRoute(JournalRouteType::Read)]
final class MemoryListCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'memory:list {--page=1} {--json}';

    protected $description = 'List the memories of the calling agent';

    public function handle(): int
    {
        return $this->runCall(ListMemoriesPayload::from(['page' => (int) $this->option('page')]));
    }
}
