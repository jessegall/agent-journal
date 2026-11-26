<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Processes\Api\ProposeReaderPayload;
use Illuminate\Console\Command;

/**
 * Proposes the reader for a command request's declaration revision; the journal stores it as a draft.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderProposeCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'reader:propose {request : The command request id} {--declaration-revision= : The declaration revision the reader reads} {--definition= : The reader definition as JSON} {--json}';

    protected $description = 'Propose a draft reader for a command request';

    public function handle(): int
    {
        $definition = $this->jsonOption('definition');

        if ($definition === null) {
            return self::FAILURE;
        }

        return $this->runCall(ProposeReaderPayload::from([
            'commandRequest' => (string) $this->argument('request'),
            'declarationRevision' => (int) $this->option('declaration-revision'),
            'definition' => $definition,
        ]));
    }
}
