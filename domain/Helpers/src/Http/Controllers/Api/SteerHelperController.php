<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Domain\Helpers\Api\SteerHelperPayload;
use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\Data\HelperSteerData;

/**
 * Steers the helper's live job, or keeps the steering, and answers what it did.
 */
final readonly class SteerHelperController
{
    #[Dispatches(SteerHelperCommand::class)]
    public function __invoke(SteerHelperPayload $call, CommandBus $commands): HelperSteerData
    {
        return HelperSteerData::from($commands->run(new SteerHelperCommand($call->identityId, $call->text)));
    }
}
