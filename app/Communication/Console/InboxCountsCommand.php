<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Communication\Calls\CountInboxMessagesCall;
use Illuminate\Console\Command;

final class InboxCountsCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:counts {inbox} {--json}';

    protected $description = 'Count what is unread and what waits in an inbox';

    public function handle(): int
    {
        return $this->runCall(CountInboxMessagesCall::from([
            'inboxId' => (string) $this->argument('inbox'),
        ]));
    }
}
