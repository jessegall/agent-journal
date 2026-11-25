<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Calls\DocumentCalls;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class ReportSettleCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'report:settle {number} {--why= : Why the report needs no more attention}';

    protected $description = 'Settle a report as needing no more attention';

    protected $help = 'Example: php artisan report:settle 7 --why "Handled in task 12"';

    public function handle(DocumentCalls $documents): int
    {
        $number = (string) $this->argument('number');

        return $this->runReport(function () use ($documents, $number): CommandReport {
            $documents->settleReport($number, (string) $this->option('why'));

            return CommandReport::ending(self::SUCCESS)->line("Settled {$number}.");
        });
    }
}
