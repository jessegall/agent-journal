<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Helpers\Calls\SendHelperCall;
use Domain\Helpers\Commands\SendHelper;
use Domain\Helpers\Http\Data\HelperReceiptData;
use Domain\Helpers\Values\HelperWork;

/**
 * Gives the named helper new work and answers the receipt.
 */
final readonly class SendHelperController
{
    public function __invoke(SendHelperCall $call, CommandBus $commands): HelperReceiptData
    {
        return HelperReceiptData::from($commands->run(new SendHelper(
            $call->requestKey->value,
            $call->identityId,
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
        )));
    }
}
