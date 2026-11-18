<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class ReportShowCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'report:show {number}';

    protected $description = 'Show one report with its whole text';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/reports/show', ['number' => (string) $this->argument('number')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->line("report {$reply['number']}: {$reply['title']}");
        $this->line((string) $reply['abstract']);
        $this->newLine();
        $this->line((string) $reply['body']);

        return self::SUCCESS;
    }
}
