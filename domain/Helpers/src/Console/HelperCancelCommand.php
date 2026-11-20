<?php

declare(strict_types=1);

namespace Domain\Helpers\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Helpers\Calls\CancelHelperJobCall;
use Domain\Helpers\Calls\HelperCalls;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class HelperCancelCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'helper:cancel {identity} {--job= : The job to cancel} {--json : Print the answer as JSON}';

    protected $description = "Cancel a helper's job; its workspace stays";

    public function handle(HelperCalls $helpers): int
    {
        $call = CancelHelperJobCall::from(['jobId' => (string) $this->option('job'), 'requestKey' => new CallKey()]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(function () use ($helpers, $call): CommandReport {
            $cancelled = $helpers->cancelHelperJob($call->jobId, $call->requestKey);

            return CommandReport::ending(self::SUCCESS)
                ->line("Cancelled job {$cancelled->jobId}; its workspace stays.");
        });
    }
}
