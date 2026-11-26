<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Notifications\Contracts\Notifications;
use App\Notifications\Data\NotificationTarget;
use App\Notifications\Enums\NotificationSourceType;
use Domain\Helpers\Events\ReportJobLinked;
use Domain\Helpers\Models\HelperJob;

/**
 * Gives the parent recorded on the job a report answers one report-ready receipt, in the transaction that tied the
 * report to the job. Only the tie delivers, so a chat announcement of the same report adds nothing, and the helper's
 * later jobs never redirect it.
 */
#[InCommandTransaction]
final readonly class DeliverReportReadyNotification implements Listener
{
    /**
     * The target key Documents registers its report resolver under; named as text so Helpers reads no Documents
     * class beyond its events.
     */
    private const string REPORT_TARGET = 'report';

    public function __construct(private Notifications $notifications) {}

    public function handle(ReportJobLinked $fact): void
    {
        $job = HelperJob::query()->acrossActors()->findOrFail($fact->helperJobId);

        $this->notifications->deliver(
            "report:{$fact->reportId}",
            NotificationSourceType::Report,
            new NotificationTarget(self::REPORT_TARGET, (string) $fact->reportNumber),
            [$job->actor()],
        );
    }
}
