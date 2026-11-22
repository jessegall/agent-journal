<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Contracts\CommandBus;
use App\Values\CallAccepted;
use Domain\Documents\Calls\SettleReportCall;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;

/**
 * Settles a report.
 */
final readonly class SettleReportController
{
    public function __invoke(SettleReportCall $call, CommandBus $commands): CallAccepted
    {
        $commands->run(new CloseReportCommand($call->number, $call->reason));

        return new CallAccepted();
    }
}
