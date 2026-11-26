<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\WithdrawCommandRequest;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Exceptions\RequestTransitionRefused;
use App\Models\CommandRules\CommandRequest;
use App\Processes\ProcessAdministration;

final readonly class WithdrawCommandRequestHandler implements CommandHandler
{
    public function __construct(private ProcessAdministration $administration) {}

    /**
     * @throws RequestTransitionRefused
     */
    public function handle(WithdrawCommandRequestCommand $command): string
    {
        $actor = $command->dispatchedBy();
        $request = CommandRequest::findLockedForChange($command->requestId);

        if (! $this->administration->isGrantedToCaller() && ! $request->isByActor($actor)) {
            throw RequestTransitionRefused::notTheRequester();
        }

        $request->withdraw();

        return $request->getKey();
    }
}
