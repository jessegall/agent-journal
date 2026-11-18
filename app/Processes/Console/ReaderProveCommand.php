<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Asks the journal to prove a request's draft reader against the real sample runs named by --output.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderProveCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'reader:prove {request : The command request id}'
        .' {--reader-revision= : The draft reader revision}'
        .' {--output=* : A sample run to replay the reader over} {--json}';

    protected $description = 'Prove a draft reader against real sample runs';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/requests/{$this->argument('request')}/proofs", [
            'reader_revision' => (string) $this->option('reader-revision'),
            'runs' => array_values(array_map(strval(...), (array) $this->option('output'))),
        ]);
    }
}
