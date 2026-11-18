<?php

declare(strict_types=1);

namespace App\Records\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class LinkAddCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'link:add {source : Such as "doc 12"} {target : Such as "task 7"} {--json}';

    protected $description = 'Link two records, such as doc 12 and task 7';

    protected $help = 'Example: php artisan link:add "report 7" "plan 3"; you must be allowed to change the first record and read the second';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/links/add', ['source' => (string) $this->argument('source'), 'target' => (string) $this->argument('target')]);
    }
}
