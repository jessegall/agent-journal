<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Supervision\ShowAskPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ShowAskCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'ask:show {ask} {--json}';

    protected $description = 'Read one ask';

    public function handle(): int
    {
        return $this->runCall(ShowAskPayload::from([
            'id' => (string) $this->argument('ask'),
        ]));
    }
}
