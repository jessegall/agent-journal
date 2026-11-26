<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Sharing\ShareStatusPayload;
use App\Console\Concerns\RunsApiPipelines;
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
