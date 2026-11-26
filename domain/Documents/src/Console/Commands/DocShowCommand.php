<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Values\CommandReport;
use Domain\Documents\Api\DocumentApi;
use Domain\Documents\Console\Concerns\PrintsRecordText;
use Domain\Documents\Data\DraftView;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocShowCommand extends Command
{
    use PrintsRecordText;
    use RunsApiPipelines;

    protected $signature = 'doc:show {number} {--section= : A section by number or exact heading} {--lines= : A line range, a-b} {--bullets : Only the bullet lines} {--grep= : Only the lines holding these words} {--all : The whole text, past the usual bound} {--revision= : An earlier revision} {--at-revision= : Continue a read begun on this revision} {--draft : Show your own open draft instead of the published text}';

    protected $description = 'Show one document: its outline, or the part of its text you ask for';

    protected $help = 'Example: php artisan doc:show 4 prints the outline; doc:show 4 --section 3 or --lines 10-40 prints a part; --draft shows your own open draft';

    public function handle(DocumentApi $documents): int
    {
        $number = (string) $this->argument('number');

        if ($this->option('draft') === true) {
            return $this->runReport(fn () => $this->draftReport($documents->showDraft($number)));
        }

        return $this->runReport(fn () => $this->recordTextReport($documents->showDocument(
            number: $number,
            selection: $this->selection(),
            revision: is_string($this->option('revision')) ? (int) $this->option('revision') : null,
            atRevision: is_string($this->option('at-revision')) ? (int) $this->option('at-revision') : null,
        ), "doc:show {$number}"));
    }

    private function draftReport(DraftView $draft): CommandReport
    {
        return CommandReport::ending(self::SUCCESS)
            ->line("doc {$draft->documentNumber}, your draft at version {$draft->version}: {$draft->title}")
            ->line((string) $draft->abstract)
            ->line('')
            ->line((string) $draft->body);
    }
}
