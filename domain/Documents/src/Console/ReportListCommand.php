<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class ReportListCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'report:list {--state=active : active, settled or all} {--page=1}';

    protected $description = 'List the reports of this journal, newest first';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/reports/list', ['attention' => (string) $this->option('state'), 'page' => (int) $this->option('page')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        foreach ($reply['rows'] as $row) {
            $this->line("report {$row['number']}  {$row['title']}: {$row['abstract']}");
        }

        if ($reply['hasNextPage']) {
            $this->line('More on page '.((int) $reply['page'] + 1).'.');
        }

        return self::SUCCESS;
    }
}
