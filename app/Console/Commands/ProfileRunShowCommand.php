<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Scripts\Api\ShowProfileRunPayload;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileRunShowCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'profile:run-show {run} {--json}';

    protected $description = 'Read one of your profile runs and its recorded steps';

    public function handle(): int
    {
        return $this->runCall(ShowProfileRunPayload::from(['id' => (string) $this->argument('run')]));
    }
}
