<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\WithdrawCommandRequest;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Models\CommandRequest;

final readonly class WithdrawCommandRequestHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws RequestTransitionRefused
     */
    public function handle(WithdrawCommandRequest $command): string
    {
        $actor = ActorIdentity::of($this->actors->actor());
        $request = CommandRequest::query()->whereKey($command->requestId)->lockForUpdate()->sole();
        if ($actor->type !== ActorType::User && ! $request->isOpenedBy($actor)) {
            throw RequestTransitionRefused::notTheRequester();
        }
        $request->withdraw();

        return $request->id;
    }
}
