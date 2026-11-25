<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Supervision\WithdrawAskPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class WithdrawAskCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'ask:withdraw {ask} {--request-key=} {--json}';

    protected $description = 'Withdraw an ask you submitted';

    public function handle(): int
    {
        return $this->runCall(WithdrawAskPayload::from([
            'id' => (string) $this->argument('ask'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
