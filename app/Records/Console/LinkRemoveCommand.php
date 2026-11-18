<?php

declare(strict_types=1);

namespace App\Records\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class LinkRemoveCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'link:remove {source : Such as "doc 12"} {target : Such as "task 7"} {--json}';

    protected $description = 'Remove the link between two records; both records stay';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/links/remove', ['source' => (string) $this->argument('source'), 'target' => (string) $this->argument('target')]);
    }
}
