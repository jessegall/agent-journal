<?php

declare(strict_types=1);

namespace Domain\Helpers\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use App\Values\CommandReport;
use Domain\Helpers\Calls\HelperCalls;
use Domain\Helpers\Calls\ListHelperNoticesCall;
use Domain\Helpers\Data\HelperNoticeData;
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
