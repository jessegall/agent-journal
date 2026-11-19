<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class InboxCountsCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'message:counts {inbox} {--json}';

    protected $description = 'Count what is unread and what waits in an inbox';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/communication/counts', [
            'inboxId' => (string) $this->argument('inbox'),
        ]);
    }
}
