<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class InboxHistoryCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'message:history
        {inbox}
        {--older= : The cursor of the next older page}
        {--limit=50}
        {--json}';

    protected $description = 'Page through the history of an inbox, newest page first';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/communication/history', [
            'inboxId' => (string) $this->argument('inbox'),
            'olderCursor' => $this->option('older'),
            'limit' => (int) $this->option('limit'),
        ]);
    }
}
