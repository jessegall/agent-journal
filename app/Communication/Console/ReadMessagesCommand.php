<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class ReadMessagesCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'message:read
        {inbox}
        {ids* : Up to 100 message ids}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Read messages in one of your inboxes; the first reader of a question takes it up';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/communication/read', [
            'inboxId' => (string) $this->argument('inbox'),
            'messageIds' => (array) $this->argument('ids'),
        ]);
    }
}
