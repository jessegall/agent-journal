<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Supervision\ReplyToAskPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class ReplyToAskCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'ask:reply {ask} {text} {--request-key=} {--json}';

    protected $description = 'Answer an ask you hold';

    public function handle(): int
    {
        return $this->runCall(ReplyToAskPayload::from([
            'id' => (string) $this->argument('ask'),
            'body' => (string) $this->argument('text'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
