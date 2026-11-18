<?php

declare(strict_types=1);

namespace App\Records\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class LinkRemoveCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'link:remove {source : Such as "doc 12"} {target : Such as "task 7"} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Remove the link between two records; both records stay';

    protected $help = 'Example: php artisan link:remove "report 7" "plan 3"; both records stay';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/links/remove', ['source' => (string) $this->argument('source'), 'target' => (string) $this->argument('target')]);
    }
}
