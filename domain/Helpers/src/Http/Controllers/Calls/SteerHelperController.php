<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Helpers\Calls\SteerHelperCall;
use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\Http\Data\HelperSteerData;

/**
 * Steers the helper's live job, or keeps the steering, and answers what it did.
 */
final readonly class SteerHelperController
{
    public function __invoke(SteerHelperCall $call, CommandBus $commands): HelperSteerData
    {
        return HelperSteerData::from($commands->run(new SteerHelperCommand($call->identityId, $call->text)));
    }
}
