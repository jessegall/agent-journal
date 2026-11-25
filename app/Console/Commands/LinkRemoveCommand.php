<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Records\RemoveLinkCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class LinkRemoveCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'link:remove {source : Such as "doc 12"} {target : Such as "task 7"} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Remove the link between two records; both records stay';

    protected $help = 'Example: php artisan link:remove "report 7" "plan 3"; both records stay';

    public function handle(): int
    {
        return $this->runCall(RemoveLinkCall::from([
            'source' => (string) $this->argument('source'),
            'target' => (string) $this->argument('target'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
