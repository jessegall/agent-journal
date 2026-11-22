<?php

declare(strict_types=1);

namespace App\Commands\WithdrawCommandRequest;

use App\Contracts\CommandHandler;
use App\Exceptions\RequestTransitionRefused;
use App\Models\CommandRequest;
use App\Support\ActorIdentity;
use App\Support\ProcessAdministration;

final readonly class WithdrawCommandRequestHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration) {}

    /**
     * @throws RequestTransitionRefused
     */
    public function handle(WithdrawCommandRequestCommand $command): string
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $request = CommandRequest::lockedForChange($command->requestId);

        if (! $this->administration->isGrantedToCaller() && ! $request->isByActor($actor)) {
            throw RequestTransitionRefused::notTheRequester();
        }

        $request->withdraw();

        return $request->id;
    }
}
