<?php

declare(strict_types=1);

namespace Domain\Helpers\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Helpers\Calls\HelperCalls;
use Domain\Helpers\Calls\ListHelperNoticesCall;
use Domain\Helpers\Http\Data\HelperNoticeData;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class HelperNoticesCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'helper:notices {--json : Print the notices as JSON}';

    protected $description = "List the newest notices about your helpers' jobs";

    public function handle(HelperCalls $helpers): int
    {
        if ($this->option('json') === true) {
            return $this->runCall(ListHelperNoticesCall::from([]));
        }

        return $this->runReport(fn (): CommandReport => array_reduce(
            $helpers->listHelperNotices()->notices,
            fn (CommandReport $report, HelperNoticeData $notice) => $report->line(
                "{$notice->jobId} ({$notice->jobState}): {$notice->text}",
            ),
            CommandReport::ending(self::SUCCESS),
        ));
    }
}
