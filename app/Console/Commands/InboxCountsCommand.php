<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\CountInboxMessagesCall;
use App\Console\Concerns\RunsCallPipelines;
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
