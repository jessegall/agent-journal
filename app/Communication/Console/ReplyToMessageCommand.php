<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class ReplyToMessageCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'message:reply
        {id}
        {version : The state version you read}
        {body}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Reply to a message at the version you read';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/communication/reply', [
            'messageId' => (string) $this->argument('id'),
            'expectedStateVersion' => (int) $this->argument('version'),
            'body' => (string) $this->argument('body'),
        ]);
    }
}
