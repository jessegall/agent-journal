<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Concerns\PrintsInspection;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ReportInspectCommand extends Command
{
    use PrintsInspection;
    use RunsCallPipelines;

    protected $signature = 'report:inspect {number}';

    protected $description = 'Show whether a report is being edited, whether it asks for attention, and its history';

    protected $help = 'Example: php artisan report:inspect 7';

    public function handle(DocumentCalls $documents): int
    {
        return $this->runReport(
            fn (): CommandReport => $this->inspectionReport(
                $documents->inspectReport((string) $this->argument('number')),
            ),
        );
    }
}
