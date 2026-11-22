<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\ShowMessageCall;
use App\Console\Concerns\RunsCallPipelines;
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
