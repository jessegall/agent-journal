<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Communication\Calls\ClaimSpeechCall;
use Illuminate\Console\Command;

final class ClaimSpeechCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:claim
        {inbox : The inbox id of the chat}
        {root : The id of the user message your turn is on}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Claim your turn to speak on one user message of a chat, for two minutes';

    public function handle(): int
    {
        return $this->runCall(ClaimSpeechCall::from([
            'inboxId' => (string) $this->argument('inbox'),
            'rootId' => (string) $this->argument('root'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
