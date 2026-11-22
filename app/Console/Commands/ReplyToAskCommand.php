<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Supervision\ReplyToAskCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class ReplyToAskCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'ask:reply {ask} {text} {--request-key=} {--json}';

    protected $description = 'Answer an ask you hold';

    public function handle(): int
    {
        return $this->runCall(ReplyToAskCall::from([
            'id' => (string) $this->argument('ask'),
            'body' => (string) $this->argument('text'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
