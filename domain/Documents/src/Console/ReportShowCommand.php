<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Concerns\PrintsRecordText;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ReportShowCommand extends Command
{
    use PrintsRecordText;
    use RunsCallPipelines;

    protected $signature = 'report:show {number} {--section= : A section by number or exact heading} {--lines= : A line range, a-b} {--bullets : Only the bullet lines} {--grep= : Only the lines holding these words} {--all : The whole text, past the usual bound}';

    protected $description = 'Show one report: its outline, or the part of its text you ask for';

    protected $help = 'Example: php artisan report:show 7 prints the outline; report:show 7 --section 2 prints a part';

    public function handle(DocumentCalls $documents): int
    {
        $number = (string) $this->argument('number');

        return $this->runReport(fn (): CommandReport => $this->recordTextReport(
            $documents->showReport(number: $number, selection: $this->selection()),
            "report:show {$number}",
        ));
    }
}
