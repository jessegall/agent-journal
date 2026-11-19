<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Communication\Calls\ReplyToMessageCall;
use Illuminate\Console\Command;

final class ReplyToMessageCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:reply
        {id}
        {version : The state version you read}
        {body}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Reply to a message at the version you read';

    public function handle(): int
    {
        return $this->runCall(ReplyToMessageCall::from([
            'messageId' => (string) $this->argument('id'),
            'expectedStateVersion' => (int) $this->argument('version'),
            'body' => (string) $this->argument('body'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
