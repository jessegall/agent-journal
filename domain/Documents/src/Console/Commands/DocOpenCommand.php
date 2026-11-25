<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Api\DocumentApi;
use Domain\Documents\Console\Commands\Support\DraftTokens;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class DocOpenCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'doc:open {number}';

    protected $description = 'Open a draft of a document to edit it';

    protected $help = 'Example: php artisan doc:open 4, then edit with doc:edit 4 and finish with doc:close 4';

    public function handle(DocumentApi $documents, DraftTokens $drafts): int
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
