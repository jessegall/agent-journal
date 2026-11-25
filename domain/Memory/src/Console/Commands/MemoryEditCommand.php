<?php

declare(strict_types=1);

namespace Domain\Memory\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Memory\Calls\EditMemoryCall;
use Illuminate\Console\Command;

/**
 * Change the text or weight of a memory of the calling agent, asked of the journal over a signed call with the
 * start's token: the start decides whose memory it is, never an option.
 */
#[JournalRoute(JournalRouteType::Write)]
final class MemoryEditCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'memory:edit {memory : The memory id} {--revision= : The revision you read, from memory:list} {--text= : The new text} {--weight= : The new weight, 1 to 10} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Change the text or weight of a memory of the calling agent';

    public function handle(): int
    {
        $weight = $this->option('weight');

        return $this->runCall(EditMemoryCall::from([
            'memoryId' => (string) $this->argument('memory'),
            'revision' => (int) $this->option('revision'),
            'text' => is_string($this->option('text')) ? $this->option('text') : null,
            'weight' => is_string($weight) ? (int) $weight : null,
            'requestKey' => $this->requestKey(),
        ]));
    }
}
