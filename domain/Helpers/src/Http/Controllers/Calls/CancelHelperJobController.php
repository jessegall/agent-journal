<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Helpers\Calls\CancelHelperJobCall;
use Domain\Helpers\Commands\CancelHelperJob;
use Domain\Helpers\Http\Data\HelperJobNamed;

/**
 * Cancels the caller's helper job and answers its id.
 */
final readonly class CancelHelperJobController
{
    public function __invoke(CancelHelperJobCall $call, CommandBus $commands): HelperJobNamed
    {
        return HelperJobNamed::from([
            'jobId' => $commands->run(new CancelHelperJob($call->jobId, $call->requestKey->value)),
        ]);
    }
}
