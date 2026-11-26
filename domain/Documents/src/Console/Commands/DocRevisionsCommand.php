<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Values\CommandReport;
use Domain\Documents\Api\DocumentApi;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocRevisionsCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'doc:revisions {number} {--page=1}';

    protected $description = 'List the revisions of a document';

    protected $help = 'Example: php artisan doc:revisions 4';

    public function handle(DocumentApi $documents): int
    {
        return $this->runReport(function () use ($documents): CommandReport {
            $page = $documents->listDocumentRevisions((string) $this->argument('number'), (int) $this->option('page'));
            $report = CommandReport::ending(self::SUCCESS);

            foreach ($page->revisions as $revision) {
                $authorLabel = "by {$revision->authorType} {$revision->authorId}";
                $line = "revision {$revision->number}  {$revision->title}  {$authorLabel}  {$revision->closedAt}";
                $report = $report->line($line);
            }

            return $report;
        });
    }
}
