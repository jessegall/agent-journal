<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Scripts\ShowProfileRunCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileRunShowCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'profile:run-show {run} {--json}';

    protected $description = 'Read one of your profile runs and its recorded steps';

    public function handle(): int
    {
        return $this->runCall(ShowProfileRunCall::from(['id' => (string) $this->argument('run')]));
    }
}
