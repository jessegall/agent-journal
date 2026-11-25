<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Concerns\PrintsInspection;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocInspectCommand extends Command
{
    use PrintsInspection;
    use RunsCallPipelines;

    protected $signature = 'doc:inspect {number}';

    protected $description = 'Show whether a document is being edited, whether it asks for attention, and its history';

    protected $help = 'Example: php artisan doc:inspect 4 shows who edits it, its attention, settlements, draft closes and links';

    public function handle(DocumentCalls $documents): int
    {
        return $this->runReport(
            fn () => $this->inspectionReport(
                $documents->inspectDocument((string) $this->argument('number')),
            ),
        );
    }
}
