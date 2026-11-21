<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\StartRecordResolver;
use App\Agents\Support\StartRecordDetails;
use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use Domain\Documents\Api\Events\ReportFiled;
use Domain\Helpers\Support\ReportJobLinking;

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
            fn (StartRecordDetails $start) => $this->linking->link($fact->reportId, $filer, $start),
        );
    }
}
