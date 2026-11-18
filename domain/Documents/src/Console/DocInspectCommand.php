<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Console\Concerns\PrintsInspection;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocInspectCommand extends Command
{
    use PrintsInspection;

    protected $signature = 'doc:inspect {number}';

    protected $description = 'Show whether a document is being edited, whether it asks for attention, and its history';

    protected $help = 'Example: php artisan doc:inspect 4 shows who edits it, its attention, settlements, draft closes and links';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->showInspection($journal, '/agent/docs/inspect');
    }
}
