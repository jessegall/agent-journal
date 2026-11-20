<?php

declare(strict_types=1);

namespace App\Supervision\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Supervision\Calls\ReplyToAskCall;
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
