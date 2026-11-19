<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class DismissMessageCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'message:dismiss
        {id}
        {reason}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Withdraw or decline a message with a reason';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/communication/dismiss', [
            'messageId' => (string) $this->argument('id'),
            'reason' => (string) $this->argument('reason'),
        ]);
    }
}
