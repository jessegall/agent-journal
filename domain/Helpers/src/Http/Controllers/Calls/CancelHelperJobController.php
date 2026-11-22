<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use App\Contracts\CommandBus;
use Domain\Helpers\Calls\CancelHelperJobCall;
use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\Data\HelperJobNamed;

/**
 * Cancels the caller's helper job and answers its id.
 */
final readonly class CancelHelperJobController
{
    public function __invoke(CancelHelperJobCall $call, CommandBus $commands): HelperJobNamed
    {
        return HelperJobNamed::from([
            'jobId' => $commands->run(new CancelHelperJobCommand($call->jobId, $call->requestKey->value)),
        ]);
    }
}
