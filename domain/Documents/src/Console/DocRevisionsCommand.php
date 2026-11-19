<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Calls\DocumentCalls;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocRevisionsCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'doc:revisions {number} {--page=1}';

    protected $description = 'List the revisions of a document';

    protected $help = 'Example: php artisan doc:revisions 4';

    public function handle(DocumentCalls $documents): int
    {
        return $this->runReport(function () use ($documents): CommandReport {
            $page = $documents->listDocumentRevisions((string) $this->argument('number'), (int) $this->option('page'));
            $report = CommandReport::ending(self::SUCCESS);

            foreach ($page->revisions as $revision) {
                $by = "by {$revision->authorType} {$revision->authorId}";
                $line = "revision {$revision->number}  {$revision->title}  {$by}  {$revision->closedAt}";
                $report = $report->line($line);
            }

            return $report;
        });
    }
}
