<?php

declare(strict_types=1);

namespace Domain\Helpers\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use Domain\Helpers\Commands\SendHelper;
use Domain\Helpers\Support\DispatchRequest;
use Domain\Helpers\Support\HelperDispatch;
use Domain\Helpers\Support\HelperReceipt;

/**
 * Dispatches new work to the helper identity the caller names, inside the command's transaction.
 */
final readonly class SendHelperHandler implements CommandHandler
{
    public function __construct(private HelperDispatch $dispatch) {}

    public function handle(SendHelper $command): HelperReceipt
    {
        return $this->dispatch->send(new DispatchRequest(
            ActorIdentity::of($command->dispatchedBy()),
            $command->requestId,
            $command->profileKey,
            $command->model,
            $command->programKey,
            $command->work,
            $command->identityId,
        ));
    }
}
