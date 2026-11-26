<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\ProveReaderPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

/**
 * Asks the journal to prove a request's draft reader against the real sample runs named by --output.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderProveCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'reader:prove {request : The command request id} {--reader-revision= : The draft reader revision} {--output=* : A sample run to replay the reader over} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Prove a draft reader against real sample runs';

    public function handle(): int
    {
        return $this->runCall(ProveReaderPayload::from([
            'commandRequest' => (string) $this->argument('request'),
            'readerRevision' => (string) $this->option('reader-revision'),
            'runs' => array_values(array_map(strval(...), (array) $this->option('output'))),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
