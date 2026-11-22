<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\AskMessageCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

final class AskMessageCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:ask
        {from : Your inbox id}
        {to : The destination inbox id}
        {body}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Ask a question from your inbox to another inbox';

    public function handle(): int
    {
        return $this->runCall(AskMessageCall::from([
            'message' => [
                'sourceInboxId' => (string) $this->argument('from'),
                'destinationInboxId' => (string) $this->argument('to'),
                'body' => (string) $this->argument('body'),
            ],
            'requestKey' => $this->requestKey(),
        ]));
    }
}
