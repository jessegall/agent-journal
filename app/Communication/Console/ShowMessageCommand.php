<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Communication\Calls\ShowMessageCall;
use Illuminate\Console\Command;

final class ShowMessageCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:show {id} {--json}';

    protected $description = 'Show one message you may see';

    public function handle(): int
    {
        return $this->runCall(ShowMessageCall::from([
            'messageId' => (string) $this->argument('id'),
        ]));
    }
}
