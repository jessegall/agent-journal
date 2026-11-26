<?php

declare(strict_types=1);

namespace Domain\Helpers\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Support\CallKey;
use App\Values\CommandReport;
use Domain\Helpers\Api\CancelHelperJobPayload;
use Domain\Helpers\Api\HelperApi;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class HelperCancelCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'helper:cancel {identity} {--job= : The job to cancel} {--json : Print the answer as JSON}';

    protected $description = "Cancel a helper's job; its workspace stays";

    public function handle(HelperApi $helpers): int
    {
        $call = CancelHelperJobPayload::from(['jobId' => (string) $this->option('job'), 'requestKey' => new CallKey()]);

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
