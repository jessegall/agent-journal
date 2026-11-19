<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class SendMessageCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'message:send
        {from : Your inbox id}
        {to : The destination inbox id}
        {body}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Send a note from your inbox to another inbox';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/communication/send', [
            'sourceInboxId' => (string) $this->argument('from'),
            'destinationInboxId' => (string) $this->argument('to'),
            'body' => (string) $this->argument('body'),
        ]);
    }
}
