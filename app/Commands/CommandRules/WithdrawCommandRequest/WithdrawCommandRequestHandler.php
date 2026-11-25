<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\WithdrawCommandRequest;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\RequestTransitionRefused;
use App\Models\CommandRules\CommandRequest;
use App\Support\ActorReference;
use App\Support\ProcessAdministration;

final readonly class WithdrawCommandRequestHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration) {}

    /**
     * @throws RequestTransitionRefused
     */
    public function handle(WithdrawCommandRequestCommand $command): string
    {
        $actor = ActorReference::of($command->dispatchedBy());
        $request = CommandRequest::findLockedForChange($command->requestId);

        if (! $this->administration->isGrantedToCaller() && ! $request->isByActor($actor)) {
            throw RequestTransitionRefused::notTheRequester();
        }

        $request->withdraw();

        return $request->id;
    }
}
