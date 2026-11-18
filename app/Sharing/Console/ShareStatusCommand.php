<?php

declare(strict_types=1);

namespace App\Sharing\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

/**
 * An agent reads its own share proposals, over a signed call: number and state only.
 */
final class ShareStatusCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'share:status {--json}';

    protected $description = 'Show your share proposals and what became of them';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/sharing/status', []);
    }
}
