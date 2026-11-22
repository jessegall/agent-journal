<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Concerns\ReportsRecordCards;
use Domain\Documents\Enums\AttentionFilter;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ReportListCommand extends Command
{
    use ReportsRecordCards;
    use RunsCallPipelines;

    protected $signature = 'report:list {--state=active : active, settled or all} {--page=1} {--query= : Only those whose text holds these words} {--after= : Continue after this cursor}';

    protected $description = 'List the reports of this journal, newest first';

    protected $help = 'Example: php artisan report:list --state all --query "starter"';

    public function handle(DocumentCalls $documents): int
    {
        return $this->runReport(function () use ($documents): CommandReport {
            $listing = $documents->listReports(
                attention: AttentionFilter::from((string) $this->option('state')),
                page: (int) $this->option('page'),
                query: is_string($this->option('query')) ? $this->option('query') : null,
                after: is_string($this->option('after')) ? $this->option('after') : null,
            );

            return $this->cardsReport('report', $listing->rows, $listing->next);
        });
    }
}
