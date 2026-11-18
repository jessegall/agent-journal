<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\PrintsInspection;
use Illuminate\Console\Command;

final class ReportInspectCommand extends Command
{
    use PrintsInspection;

    protected $signature = 'report:inspect {number}';

    protected $description = 'Show whether a report is being edited, whether it asks for attention, and its history';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->showInspection($journal, '/agent/reports/inspect');
    }
}
