<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Actors\Support\ActorContext;
use App\Contracts\Attributes\RequiresListener;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A report was filed. It carries ids and the number, never the text. Helpers ties it to the helper job it answers in
 * the filing's transaction; its listener is named as text so Documents does not depend on Helpers.
 */
#[RequiresListener('Domain\Helpers\Listeners\LinkReportToJob')]
final readonly class ReportFiled implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $reportId,
        public int $number,
        public ActorContext $actor,
    ) {}
}
