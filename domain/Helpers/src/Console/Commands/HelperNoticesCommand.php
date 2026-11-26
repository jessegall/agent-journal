<?php

declare(strict_types=1);

namespace Domain\Helpers\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Values\CommandReport;
use Domain\Helpers\Api\HelperApi;
use Domain\Helpers\Api\ListHelperNoticesPayload;
use Domain\Helpers\Data\HelperNoticeData;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class HelperNoticesCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'helper:notices {--json : Print the notices as JSON}';

    protected $description = "List the newest notices about your helpers' jobs";

    public function handle(HelperApi $helpers): int
    {
        if ($this->option('json') === true) {
            return $this->runCall(ListHelperNoticesPayload::from([]));
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
