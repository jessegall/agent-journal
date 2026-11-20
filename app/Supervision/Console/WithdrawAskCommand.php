<?php

declare(strict_types=1);

namespace App\Supervision\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Supervision\Calls\WithdrawAskCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class WithdrawAskCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'ask:withdraw {ask} {--request-key=} {--json}';

    protected $description = 'Withdraw an ask you submitted';

    public function handle(): int
    {
        return $this->runCall(WithdrawAskCall::from([
            'id' => (string) $this->argument('ask'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
