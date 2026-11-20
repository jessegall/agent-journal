<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\AgentRequests\Values\CallAccepted;
use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use Domain\Documents\Calls\SettleReportCall;
use Domain\Documents\Commands\CloseReport;
use Illuminate\Support\Str;

/**
 * Settles a report.
 */
final readonly class SettleReportController
{
    public function __invoke(SettleReportCall $call, CommandBus $commands): CallAccepted
    {
        $reference = Str::isUlid($call->number) ? $call->number : RecordReference::number($call->number);
        $commands->run(new CloseReport($reference, $call->reason));

        return new CallAccepted();
    }
}
