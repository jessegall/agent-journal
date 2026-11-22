<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Commands\Support\DraftTokens;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class DocOpenCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'doc:open {number}';

    protected $description = 'Open a draft of a document to edit it';

    protected $help = 'Example: php artisan doc:open 4, then edit with doc:edit 4 and finish with doc:close 4';

    public function handle(DocumentCalls $documents, DraftTokens $drafts): int
    {
        return $this->runReport(function () use ($documents, $drafts): CommandReport {
            $draft = $documents->openDocument((string) $this->argument('number'));
            $drafts->keep($draft->documentNumber, $draft->token, $draft->version);

            return CommandReport::ending(self::SUCCESS)->line(
                sprintf(
                    'doc %s is open at version %s, from revision %s.',
                    $draft->documentNumber,
                    $draft->version,
                    $draft->baseRevisionNumber,
                ),
            );
        });
    }
}
