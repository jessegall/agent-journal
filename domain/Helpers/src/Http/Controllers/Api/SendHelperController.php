<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Projects\ProjectDestination;
use Domain\Helpers\Api\SendHelperPayload;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;
use Domain\Helpers\Values\HelperWork;
use PhpOption\None;

/**
 * Gives the named helper new work and answers the receipt.
 */
final readonly class SendHelperController
{
    #[Dispatches(SendHelperCommand::class)]
    public function __invoke(
        SendHelperPayload $call,
        CommandBus $commands,
        ProjectDestination $destination,
    ): HelperReceiptData {
        return HelperReceiptData::from($commands->run(new SendHelperCommand(
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
                $call->isIndependent,
            ),
            $destination->projectFor(None::create()),
        )));
    }
}
