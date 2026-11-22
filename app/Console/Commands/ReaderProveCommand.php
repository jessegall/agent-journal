<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Processes\ProveReaderCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Asks the journal to prove a request's draft reader against the real sample runs named by --output.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderProveCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'reader:prove {request : The command request id} {--reader-revision= : The draft reader revision} {--output=* : A sample run to replay the reader over} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Prove a draft reader against real sample runs';

    public function handle(): int
    {
        return $this->runCall(ProveReaderCall::from([
            'commandRequest' => (string) $this->argument('request'),
            'readerRevision' => (string) $this->option('reader-revision'),
            'runs' => array_values(array_map(strval(...), (array) $this->option('output'))),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
