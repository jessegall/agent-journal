<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Api\Communication\SendMessagePayload;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

final class SendMessageCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'message:send
        {inbox : The inbox id}
        {body}
        {--target= : The number, in the inbox, of the message this one replies to}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Send a message into an inbox you are attached to';

    public function handle(): int
    {
        $target = $this->option('target');

        return $this->runCall(SendMessagePayload::from([
            'message' => [
                'inboxId' => (string) $this->argument('inbox'),
                'body' => (string) $this->argument('body'),
                'targetMessageNumber' => $target === null ? null : (int) $target,
            ],
            'requestKey' => $this->requestKey(),
        ]));
    }
}
