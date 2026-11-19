<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class RequireMessageAnswerCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'message:require-answer
        {id}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Ask for an answer to a note you wrote';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/communication/require-answer', [
            'messageId' => (string) $this->argument('id'),
        ]);
    }
}
