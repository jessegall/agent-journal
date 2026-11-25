<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\SendHelper;

use App\Support\ActorReference;
use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Support\DispatchRequest;
use Domain\Helpers\Support\HelperDispatch;
use Domain\Helpers\Values\HelperReceipt;

/**
 * Dispatches new work to the helper identity the caller names, inside the command's transaction.
 */
final readonly class SendHelperHandler extends HelperCommandHandler
{
    public function __construct(private HelperDispatch $dispatch) {}

    public function handle(SendHelperCommand $command): HelperReceipt
    {
        return $this->dispatch->send(new DispatchRequest(
            ActorReference::of($command->dispatchedBy()),
            $command->requestId,
            $command->profileKey,
            $command->model,
            $command->driverKey,
            $command->work,
            $command->projectId,
            $command->identityId,
        ));
    }
}
