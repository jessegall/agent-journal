<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\ClaimSpeechCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

final class ClaimSpeechCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:claim
        {inbox : The inbox id of the chat}
        {root : The id of the user message your turn is on}
        {--batch= : The batch id of the chat messages this turn was shown}
        {--grant= : The claim grant those messages came with; a claim from any other turn is refused}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Claim your turn to speak on one user message of a chat, for two minutes';

    public function handle(): int
    {
        return $this->runCall(ClaimSpeechCall::from([
            'inboxId' => (string) $this->argument('inbox'),
            'rootId' => (string) $this->argument('root'),
            'batchId' => (string) $this->option('batch'),
            'grant' => (string) $this->option('grant'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
