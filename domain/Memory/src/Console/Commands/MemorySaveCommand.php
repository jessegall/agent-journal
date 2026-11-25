<?php

declare(strict_types=1);

namespace Domain\Memory\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Memory\Calls\SaveMemoryCall;
use Illuminate\Console\Command;

/**
 * Keep a memory of the calling agent, asked of the journal over a signed call with the start's token: the start
 * decides whose memory it is, never an option.
 */
#[JournalRoute(JournalRouteType::Write)]
final class MemorySaveCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'memory:save {text : What to do and when} {--weight=5 : 1 to 10} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Keep a memory of the calling agent';

    public function handle(): int
    {
        return $this->runCall(SaveMemoryCall::from([
            'text' => (string) $this->argument('text'),
            'weight' => (int) $this->option('weight'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
