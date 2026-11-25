<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Records\AddLinkCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class LinkAddCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'link:add {source : Such as "doc 12"} {target : Such as "task 7"} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Link two records, such as doc 12 and task 7';

    protected $help = 'Example: php artisan link:add "report 7" "plan 3"; you must be allowed to change the first record and read the second';

    public function handle(): int
    {
        return $this->runCall(AddLinkCall::from([
            'source' => (string) $this->argument('source'),
            'target' => (string) $this->argument('target'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
