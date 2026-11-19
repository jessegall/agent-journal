<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Communication\Calls\ReadInboxHistoryCall;
use Illuminate\Console\Command;

final class InboxHistoryCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:history
        {inbox}
        {--older= : The cursor of the next older page}
        {--limit=50}
        {--json}';

    protected $description = 'Page through the history of an inbox, newest page first';

    public function handle(): int
    {
        return $this->runCall(ReadInboxHistoryCall::from([
            'inboxId' => (string) $this->argument('inbox'),
            'page' => ['olderCursor' => $this->option('older'), 'limit' => (int) $this->option('limit')],
        ]));
    }
}
