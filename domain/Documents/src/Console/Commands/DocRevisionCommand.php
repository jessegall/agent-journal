<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Calls\DocumentCalls;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocRevisionCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'doc:revision {number} {revision}';

    protected $description = 'Show one revision of a document with its whole text';

    protected $help = 'Example: php artisan doc:revision 4 1 prints revision 1 of doc 4 in full';

    public function handle(DocumentCalls $documents): int
    {
        return $this->runReport(function () use ($documents): CommandReport {
            $revision = $documents->showDocumentRevision(
                (string) $this->argument('number'),
                (int) $this->argument('revision'),
            );

            $historicalLabel = $revision->historical ? ' (historical)' : '';
            $heading = "doc {$revision->documentNumber}, revision {$revision->number}{$historicalLabel}";

            return CommandReport::ending(self::SUCCESS)
                ->line("{$heading}: {$revision->title}")
                ->line((string) $revision->abstract)
                ->line('')
                ->line((string) $revision->body);
        });
    }
}
