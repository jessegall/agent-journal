<?php

declare(strict_types=1);

namespace Domain\Sharing\Console\Commands;

use App\Console\Concerns\RunsApiPipelines;
use Domain\Sharing\Api\ShareStatusPayload;
use Illuminate\Console\Command;

/**
 * An agent reads its own share proposals, over a signed call: number and state only.
 */
final class ShareStatusCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'share:status {--json}';

    protected $description = 'Show your share proposals and what became of them';

    public function handle(): int
    {
        return $this->runCall(new ShareStatusPayload());
    }
}
