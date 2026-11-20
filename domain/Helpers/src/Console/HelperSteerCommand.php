<?php

declare(strict_types=1);

namespace Domain\Helpers\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Helpers\Calls\HelperCalls;
use Domain\Helpers\Calls\SteerHelperCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class HelperSteerCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'helper:steer {identity} {text} {--json : Print the answer as JSON}';

    protected $description = "Steer a helper's live job, or keep the steering when none is live";

    public function handle(HelperCalls $helpers): int
    {
        $call = SteerHelperCall::from([
            'identityId' => (string) $this->argument('identity'),
            'text' => (string) $this->argument('text'),
            'requestKey' => new CallKey(),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(function () use ($helpers, $call): CommandReport {
            $steerReceipt = $helpers->steerHelper($call->identityId, $call->text, $call->requestKey);

            return $steerReceipt->jobId !== null
                ? CommandReport::ending(self::SUCCESS)->line("Steered job {$steerReceipt->jobId}.")
                : CommandReport::ending(self::SUCCESS)
                    ->line("No live job; kept as message {$steerReceipt->messageId}.")
                    ->line("Run this to carry it: {$steerReceipt->suggestedCommand}");
        });
    }
}
