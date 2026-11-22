<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\RequireMessageAnswerCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

final class RequireMessageAnswerCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:require-answer
        {id}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Ask for an answer to a note you wrote';

    public function handle(): int
    {
        return $this->runCall(RequireMessageAnswerCall::from([
            'messageId' => (string) $this->argument('id'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
