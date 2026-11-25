<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\CleanOutputPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A user removes the stored output of ended runs; --preview only lists what would go.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ProcessCleanCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'process:clean {run* : The ended runs} {--preview : Only list what would be removed} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Remove the stored output of ended runs';

    public function handle(): int
    {
        return $this->runCall(CleanOutputPayload::from([
            'runs' => array_values(array_map(strval(...), (array) $this->argument('run'))),
            'isPreview' => (bool) $this->option('preview'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
