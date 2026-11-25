<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Supervision\WithdrawAskCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
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
