<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Communication\Calls\DismissMessageCall;
use Illuminate\Console\Command;

final class DismissMessageCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:dismiss
        {id}
        {reason}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Withdraw or decline a message with a reason';

    public function handle(): int
    {
        return $this->runCall(DismissMessageCall::from([
            'messageId' => (string) $this->argument('id'),
            'reason' => (string) $this->argument('reason'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
