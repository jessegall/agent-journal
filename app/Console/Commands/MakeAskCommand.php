<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Supervision\MakeAskPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class MakeAskCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'ask:make {text} {--type=} {--request-key=} {--json}';

    protected $description = 'Ask the supervisor for help';

    public function handle(): int
    {
        return $this->runCall(MakeAskPayload::from([
            'body' => (string) $this->argument('text'),
            'type' => $this->option('type'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
