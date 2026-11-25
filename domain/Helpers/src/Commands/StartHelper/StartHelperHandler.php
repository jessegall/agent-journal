<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\StartHelper;

use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Support\DispatchRequest;
use Domain\Helpers\Support\HelperDispatch;
use Domain\Helpers\Values\HelperReceipt;

/**
 * Dispatches new work to the best of the caller's helpers, or a new one, inside the command's transaction.
 */
final readonly class StartHelperHandler extends HelperCommandHandler
{
    public function __construct(private HelperDispatch $dispatch) {}

    public function handle(StartHelperCommand $command): HelperReceipt
    {
        return $this->dispatch->start(new DispatchRequest(
            $command->dispatchedBy(),
            $command->requestId,
            $command->profileKey,
            $command->model,
            $command->driverKey,
            $command->work,
            $command->projectId,
            null,
            $command->driverType,
        ));
    }
}
