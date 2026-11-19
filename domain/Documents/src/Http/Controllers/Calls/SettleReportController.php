<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\AgentRequests\Values\CallAccepted;
use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use Domain\Documents\Calls\SettleReportCall;
use Domain\Documents\Commands\SettleReport;

/**
 * Settles a report.
 */
final readonly class SettleReportController
{
    public function __invoke(SettleReportCall $call, CommandBus $commands): CallAccepted
    {
        $commands->run(new SettleReport(RecordReference::number($call->number), $call->reason));

        return new CallAccepted();
    }
}
