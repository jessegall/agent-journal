<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Attributes\RequiresTransactionListener;
use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorContext;

/**
 * A report was filed. It carries ids and the number, never the text. Helpers ties it to the helper job it answers in
 * the filing's transaction; its listener is named as text so Documents does not depend on Helpers.
 */
#[RequiresTransactionListener('Domain\Helpers\Listeners\LinkReportToJob')]
final readonly class ReportFiled implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $reportId,
        public int $number,
        public ActorContext $actor,
    ) {}
}
