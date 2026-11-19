<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Support\DraftTokens;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class DocCloseCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'doc:close {number}';

    protected $description = 'Close the open draft of a document; a changed text becomes its next revision';

    protected $help = 'Example: php artisan doc:close 4 publishes your changes as the next revision; an unchanged draft adds none';

    public function handle(DocumentCalls $documents, DraftTokens $drafts): int
    {
        $number = (int) $this->argument('number');
        $held = $drafts->of($number);

        if ($held === null) {
            $this->error("No draft of doc {$number} is open here; open it first with doc:open {$number}.");

            return self::FAILURE;
        }

        return $this->runReport(function () use ($documents, $drafts, $number, $held): CommandReport {
            $closed = $documents->closeDocument((string) $number, $held['token'], $held['version']);
            $drafts->forget($number);

            return CommandReport::ending(self::SUCCESS)->line($closed->published
                ? "Closed doc {$number} as revision {$closed->revisionNumber}."
                : "Closed doc {$number} with no change; it stays at revision {$closed->revisionNumber}.");
        });
    }
}
