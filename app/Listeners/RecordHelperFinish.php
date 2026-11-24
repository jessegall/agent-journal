<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\HelperReportedOnRecord;
use App\Support\HelperActivity;

/**
 * Records a helper's report, when it finished, in its activity.
 */
final readonly class RecordHelperFinish implements Listener
{
    public function __construct(private HelperActivity $activity) {}

    public function handle(HelperReportedOnRecord $fact): void
    {
        $this->activity->finished($fact->helperAgentId);
    }
}
