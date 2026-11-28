<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Agents\AgentStartOnMessage;
use App\Agents\Commands\StartProfileMain\StartProfileMainCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Messages\Commands\RetryDelivery\RetryDeliveryCommand;
use Domain\Chat\Data\RetryDeliveryInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Queues a message that was not delivered again, starting its agent first when it runs no session, so the delivery
 * walks its states again.
 */
final readonly class RetryDeliveryController
{
    #[Dispatches(StartProfileMainCommand::class)]
    #[Dispatches(RetryDeliveryCommand::class)]
    public function __invoke(
        RetryDeliveryInput $input,
        AgentStartOnMessage $start,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        if ($input->agent !== null) {
            $start->prepare($input->agent, $input->expectedSessionId);
        }

        $commands->run(new RetryDeliveryCommand($input->messageId));

        return $redirect->back(303);
    }
}
