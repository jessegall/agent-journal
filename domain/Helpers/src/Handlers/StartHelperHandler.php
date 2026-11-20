<?php

declare(strict_types=1);

namespace Domain\Helpers\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Support\DispatchRequest;
use Domain\Helpers\Support\HelperDispatch;
use Domain\Helpers\Support\HelperReceipt;

/**
 * Dispatches new work to the best of the caller's helpers, or a new one, inside the command's transaction.
 */
final readonly class StartHelperHandler implements CommandHandler
{
    public function __construct(private HelperDispatch $dispatch) {}

    public function handle(StartHelper $command): HelperReceipt
    {
        return $this->dispatch->start(new DispatchRequest(
            ActorIdentity::of($command->dispatchedBy()),
            $command->requestId,
            $command->profileKey,
            $command->model,
            $command->programKey,
            $command->work,
            null,
        ));
    }
}
