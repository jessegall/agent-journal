<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\TakeNextMessagesCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

final class TakeNextMessagesCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:take-next
        {inbox}
        {--limit=1}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Take up the oldest questions nobody took up in one of your inboxes';

    public function handle(): int
    {
        return $this->runCall(TakeNextMessagesCall::from([
            'inboxId' => (string) $this->argument('inbox'),
            'limit' => (int) $this->option('limit'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
