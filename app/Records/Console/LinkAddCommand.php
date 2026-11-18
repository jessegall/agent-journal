<?php

declare(strict_types=1);

namespace App\Records\Console;

use App\AgentRequests\Console\Concerns\SendsSignedWrites;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class LinkAddCommand extends Command
{
    use SendsSignedWrites;

    protected $signature = 'link:add {source : Such as "doc 12"} {target : Such as "task 7"} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Link two records, such as doc 12 and task 7';

    protected $help = 'Example: php artisan link:add "report 7" "plan 3"; you must be allowed to change the first record and read the second';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendWriteAndPrint($journal, '/agent/links/add', ['source' => (string) $this->argument('source'), 'target' => (string) $this->argument('target')]);
    }
}
