<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class TakeNextMessagesCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'message:take-next
        {inbox}
        {--limit=1}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Take up the oldest questions nobody took up in one of your inboxes';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/communication/take-next', [
            'inboxId' => (string) $this->argument('inbox'),
            'limit' => (int) $this->option('limit'),
        ]);
    }
}
