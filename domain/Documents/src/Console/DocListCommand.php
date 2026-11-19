<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Concerns\ReportsRecordCards;
use Domain\Documents\Enums\AttentionFilter;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocListCommand extends Command
{
    use ReportsRecordCards;
    use RunsCallPipelines;

    protected $signature = 'doc:list {--state=active : active, settled or all} {--page=1} {--query= : Only those whose text holds these words} {--revisions : Search past revisions too} {--after= : Continue after this cursor}';

    protected $description = 'List the documents of this journal, newest first';

    protected $help = 'Example: php artisan doc:list --query "retention" ; continue a long list with --after <cursor>';

    public function handle(DocumentCalls $documents): int
    {
        return $this->runReport(function () use ($documents): CommandReport {
            $listing = $documents->listDocuments(
                attention: AttentionFilter::from((string) $this->option('state')),
                page: (int) $this->option('page'),
                query: is_string($this->option('query')) ? $this->option('query') : null,
                revisions: $this->option('revisions') === true,
                after: is_string($this->option('after')) ? $this->option('after') : null,
            );

            return $this->cardsReport('doc', $listing->rows, $listing->next);
        });
    }
}
