<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class ReportEditCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'report:edit {number}';

    protected $description = 'Reports never change; this explains how to correct one';

    protected $help = 'A report never changes. To correct one, file a new report with report:make and link it to the old one with --about "report 7".';

    public function handle(AgentRequestSender $journal): int
    {
        $this->sendSigned($journal, '/agent/reports/edit', ['number' => (string) $this->argument('number')]);

        return self::FAILURE;
    }
}
