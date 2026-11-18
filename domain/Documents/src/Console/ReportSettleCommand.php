<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsSettlement;
use Illuminate\Console\Command;

final class ReportSettleCommand extends Command
{
    use SendsSettlement;

    protected $signature = 'report:settle {number} {--why= : Why the report needs no more attention}';

    protected $description = 'Settle a report as needing no more attention';

    protected $help = 'Example: php artisan report:settle 7 --why "Handled in task 12"';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendSettlement($journal, '/agent/reports/settle', ['revision' => 1]);
    }
}
