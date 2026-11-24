<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers\Calls;

use App\Commands\Messages\RetryDelivery\RetryDeliveryCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\CallAccepted;
use Domain\Chat\Calls\RetryDeliveryCall;

/**
 * Asks again for a given-up piece of chat text for a journal caller, through the command the chat page uses; only an
 * operator passes its authorization.
 */
final readonly class RetryDeliveryController
{
    public function __invoke(RetryDeliveryCall $call, CommandBus $commands): CallAccepted
    {
        $commands->run(new RetryDeliveryCommand($call->range));

        return new CallAccepted();
    }
}
