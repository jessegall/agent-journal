<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Supervision\ListAsksCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ListAsksCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'ask:list {--before=} {--json}';

    protected $description = 'List asks you can read';

    public function handle(): int
    {
        return $this->runCall(ListAsksCall::from([
            'before' => $this->option('before'),
        ]));
    }
}
