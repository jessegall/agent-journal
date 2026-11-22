<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Support\StartRecordDetails;
use Domain\Helpers\Enums\ReportJobDiscrepancyReason;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\ReportJobDiscrepancy;
use Domain\Helpers\Models\ReportJobLink;
use Domain\Helpers\Values\FiledReport;

/**
 * Ties a filed report to the helper job its filing session was started for, from that session's own start, never
 * from the helper's latest job: a late filing of job A after job B started still answers A. A claim the job does not
 * bear out is refused and kept as a discrepancy; a session no helper job started files a plain report.
 */
final readonly class ReportJobLinking
{
    public function link(FiledReport $report, ActorIdentity $filer, StartRecordDetails $start): void
    {
        $reportId = $report->id;
        $reference = (string) $start->ownerReference;
        [$type, $jobId] = explode(':', $reference, 2) + [1 => ''];

        if ($type !== HelperJob::LINK_TYPE) {
            return;
        }

        $job = HelperJob::query()->acrossActors()->whereKey($jobId)->first();

        if ($job === null) {
            ReportJobDiscrepancy::create($reportId, $reference, $filer, ReportJobDiscrepancyReason::JobMissing);

            return;
        }

        if (! $this->isFiledByJobHelper($job, $filer, $start)) {
            ReportJobDiscrepancy::create($reportId, $reference, $filer, ReportJobDiscrepancyReason::FilerMismatch);

            return;
        }

        $existing = ReportJobLink::ofReport($reportId);

        if ($existing->isDefined() && ! $existing->get()->isFor($job)) {
            ReportJobDiscrepancy::create($reportId, $reference, $filer, ReportJobDiscrepancyReason::ConflictingJob);

            return;
        }

        ReportJobLink::create($report, $job, $start->requestId);
    }

    /**
     * Whether the filer is the helper the job was given to and the agent the session's start started.
     */
    private function isFiledByJobHelper(HelperJob $job, ActorIdentity $filer, StartRecordDetails $start): bool
    {
        $helper = HelperIdentity::query()->acrossActors()->whereKey($job->helper_identity_id)->first();

        return $helper !== null
            && $helper->helperActor()->type === $filer->type
            && $helper->helperActor()->id === $filer->id
            && $start->agentId === $filer->id;
    }
}
