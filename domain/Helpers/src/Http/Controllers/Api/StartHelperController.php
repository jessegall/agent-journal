<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Helpers\Api\StartHelperPayload;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;
use Domain\Helpers\Values\HelperWork;

/**
 * Starts a helper for the caller's work and answers the receipt.
 */
final readonly class StartHelperController
{
    #[Dispatches(StartHelperCommand::class)]
    public function __invoke(StartHelperPayload $call, CommandBus $commands): HelperReceiptData
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
                $call->isIndependent,
            ),
            $call->driverType,
        )));
    }
}
