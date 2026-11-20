<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Helpers\Calls\StartHelperCall;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Http\Data\HelperReceiptData;
use Domain\Helpers\Support\HelperWork;

/**
 * Starts a helper for the caller's work and answers the receipt.
 */
final readonly class StartHelperController
{
    public function __invoke(StartHelperCall $call, CommandBus $commands): HelperReceiptData
    {
        return HelperReceiptData::from($commands->run(new StartHelper(
            $call->requestKey->value,
            $call->profileKey,
            $call->model,
            $call->programKey,
            HelperWork::described(
                $call->subject,
                $call->purposeId,
                $call->purposeText,
                $call->brief,
                $call->sourceSubjects,
                $call->independent,
            ),
        )));
    }
}
