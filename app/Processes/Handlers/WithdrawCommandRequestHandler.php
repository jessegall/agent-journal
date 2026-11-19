<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\WithdrawCommandRequest;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Support\ProcessAdministration;

final readonly class WithdrawCommandRequestHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration) {}

    /**
     * @throws RequestTransitionRefused
     */
    public function handle(WithdrawCommandRequest $command): string
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $request = CommandRequest::query()->whereKey($command->requestId)->lockForUpdate()->sole();
        if (! $this->administration->isGrantedToCaller() && ! $request->isByActor($actor)) {
            throw RequestTransitionRefused::notTheRequester();
        }
        $request->withdraw();

        return $request->id;
    }
}
