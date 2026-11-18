<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Console\Concerns\PrintsInspection;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ReportInspectCommand extends Command
{
    use PrintsInspection;

    protected $signature = 'report:inspect {number}';

    protected $description = 'Show whether a report is being edited, whether it asks for attention, and its history';

    protected $help = 'Example: php artisan report:inspect 7';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->showInspection($journal, '/agent/reports/inspect');
    }
}
