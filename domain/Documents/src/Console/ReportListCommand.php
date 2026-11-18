<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class ReportListCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'report:list {--state=active : active, settled or all} {--page=1} {--query= : Only those whose text holds these words} {--after= : Continue after this cursor}';

    protected $description = 'List the reports of this journal, newest first';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/reports/list', ['attention' => (string) $this->option('state'), 'page' => (int) $this->option('page'), 'query' => $this->option('query'), 'after' => $this->option('after')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        foreach ($reply['rows'] as $row) {
            $this->line("report {$row['number']}  {$row['title']}: {$row['abstract']}");

            if (isset($row['snippet'])) {
                $this->line("  {$row['foundIn']}: {$row['snippet']}");
            }
        }

        if (isset($reply['next'])) {
            $this->line("More with --after {$reply['next']}.");
        }

        return self::SUCCESS;
    }
}
