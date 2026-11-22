<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\DismissMessageCall;
use App\Console\Concerns\RunsCallPipelines;
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
