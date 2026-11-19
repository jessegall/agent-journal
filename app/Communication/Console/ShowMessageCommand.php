<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class ShowMessageCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'message:show {id} {--json}';

    protected $description = 'Show one message you may see';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/communication/show', [
            'messageId' => (string) $this->argument('id'),
        ]);
    }
}
