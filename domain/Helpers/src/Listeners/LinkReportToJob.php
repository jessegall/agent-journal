<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Contracts\StartRecordResolver;
use App\Support\ActorIdentity;
use App\Support\StartRecordDetails;
use Domain\Documents\Events\ReportFiled;
use Domain\Helpers\Support\ReportJobLinking;
use Domain\Helpers\Values\FiledReport;

/**
 * Ties a report to the helper job it answers in the transaction that filed it, from the start of the filing
 * session, so the tie commits or rolls back with the report.
 */
#[InCommandTransaction]
final readonly class LinkReportToJob implements Listener
{
    public function __construct(
        private StartRecordResolver $starts,
        private ReportJobLinking $linking,
    ) {}

    public function handle(ReportFiled $fact): void
    {
        $filer = ActorIdentity::of($fact->actor);

        $this->starts->currentOwnerStart()->forAll(
            fn (StartRecordDetails $start) => $this->linking->link(
                new FiledReport($fact->reportId, $fact->number),
                $filer,
                $start,
            ),
        );
    }
}
