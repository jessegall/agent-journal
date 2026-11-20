<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Helpers\Calls\ContinueHelperCall;
use Domain\Helpers\Commands\ContinueHelper;
use Domain\Helpers\Http\Data\HelperReceiptData;

/**
 * Continues the helper's unfinished job and answers the receipt.
 */
final readonly class ContinueHelperController
{
    public function __invoke(ContinueHelperCall $call, CommandBus $commands): HelperReceiptData
    {
        return HelperReceiptData::from($commands->run(new ContinueHelper(
            $call->requestKey->value,
            $call->identityId,
            $call->jobId,
            $call->model,
            $call->programKey,
        )));
    }
}
