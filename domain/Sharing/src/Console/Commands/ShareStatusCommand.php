<?php

declare(strict_types=1);

namespace Domain\Sharing\Console\Commands;

use Domain\Sharing\Calls\ShareStatusCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

/**
 * An agent reads its own share proposals, over a signed call: number and state only.
 */
final class ShareStatusCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'share:status {--json}';

    protected $description = 'Show your share proposals and what became of them';

    public function handle(): int
    {
        return $this->runCall(new ShareStatusCall());
    }
}
