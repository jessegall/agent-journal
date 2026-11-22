<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use App\Contracts\CommandBus;
use Domain\Helpers\Calls\StartHelperCall;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;
use Domain\Helpers\Values\HelperWork;

/**
 * Starts a helper for the caller's work and answers the receipt.
 */
final readonly class StartHelperController
{
    public function __invoke(StartHelperCall $call, CommandBus $commands): HelperReceiptData
    {
        return HelperReceiptData::from($commands->run(new StartHelperCommand(
            $call->requestKey->value,
            $call->profileKey,
            $call->model,
            $call->driverKey,
            HelperWork::described(
                $call->subject,
                $call->purposeId,
                $call->purposeText,
                $call->brief,
                $call->sourceSubjects,
                $call->independent,
            ),
            $call->mode,
        )));
    }
}
