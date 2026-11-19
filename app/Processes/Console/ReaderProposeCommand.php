<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\ProposeReaderCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Proposes the reader for a command request's declaration revision; the journal stores it as a draft.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderProposeCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'reader:propose {request : The command request id} {--declaration-revision= : The declaration revision the reader reads} {--definition= : The reader definition as JSON} {--json}';

    protected $description = 'Propose a draft reader for a command request';

    public function handle(): int
    {
        $definition = $this->jsonOption('definition');

        if ($definition === null) {
            return self::FAILURE;
        }

        return $this->runCall(ProposeReaderCall::from([
            'commandRequest' => (string) $this->argument('request'),
            'declarationRevision' => (int) $this->option('declaration-revision'),
            'definition' => $definition,
        ]));
    }
}
