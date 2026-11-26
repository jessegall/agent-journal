<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Values\ApiAccepted;
use Domain\Documents\Api\SettleReportPayload;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;

/**
 * Settles a report.
 */
final readonly class SettleReportController
{
    #[Dispatches(CloseReportCommand::class)]
    public function __invoke(SettleReportPayload $call, CommandBus $commands): ApiAccepted
    {
        $commands->run(new CloseReportCommand($call->number, $call->reason));

        return new ApiAccepted();
    }
}
