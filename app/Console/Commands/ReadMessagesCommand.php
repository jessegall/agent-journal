<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\ReadMessagesCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

final class ReadMessagesCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:read
        {inbox}
        {ids* : Up to 100 message ids}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Read messages in one of your inboxes; the first reader of a question takes it up';

    public function handle(): int
    {
        return $this->runCall(ReadMessagesCall::from([
            'inboxId' => (string) $this->argument('inbox'),
            'messageIds' => array_values(array_map(strval(...), (array) $this->argument('ids'))),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
