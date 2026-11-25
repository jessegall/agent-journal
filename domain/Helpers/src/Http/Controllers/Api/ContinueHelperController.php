<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Helpers\Api\ContinueHelperPayload;
use Domain\Helpers\Commands\ContinueHelper\ContinueHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;

/**
 * Continues the helper's unfinished job and answers the receipt.
 */
final readonly class ContinueHelperController
{
    public function __invoke(ContinueHelperPayload $call, CommandBus $commands): HelperReceiptData
    {
        return HelperReceiptData::from($commands->run(new ContinueHelperCommand(
            $call->requestKey->value,
            $call->identityId,
            $call->jobId,
            $call->model,
            $call->driverKey,
        )));
    }
}
