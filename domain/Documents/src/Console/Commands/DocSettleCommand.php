<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Calls\DocumentCalls;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class DocSettleCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'doc:settle {number} {--why= : Why the document needs no more attention} {--revision= : The revision you read; the current one when left out}';

    protected $description = 'Settle a document as needing no more attention';

    protected $help = 'Example: php artisan doc:settle 4 --why "Shipped in 6.0"; a document with an open draft must be closed first';

    public function handle(DocumentCalls $documents): int
    {
        $number = (string) $this->argument('number');

        return $this->runReport(function () use ($documents, $number): CommandReport {
            $revision = is_string($this->option('revision'))
                ? (int) $this->option('revision')
                : (int) $documents->showDocument($number)->revision;

            $documents->settleDocument($number, (string) $this->option('why'), $revision);

            return CommandReport::ending(self::SUCCESS)->line("Settled {$number}.");
        });
    }
}
