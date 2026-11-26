<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Helpers\Api\CancelHelperJobPayload;
use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\Data\HelperJobNamed;

/**
 * Cancels the caller's helper job and answers its id.
 */
final readonly class CancelHelperJobController
{
    #[Dispatches(CancelHelperJobCommand::class)]
    public function __invoke(CancelHelperJobPayload $call, CommandBus $commands): HelperJobNamed
    {
        return HelperJobNamed::from([
            'jobId' => $commands->run(new CancelHelperJobCommand($call->jobId, $call->requestKey->value)),
        ]);
    }
}
