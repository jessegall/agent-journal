<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Api\Supervision\WithdrawAskPayload;
use App\Asks\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskCard;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Values\AskReference;

final readonly class WithdrawAskController
{
    #[Dispatches(WithdrawAskCommand::class)]
    public function __invoke(WithdrawAskPayload $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new WithdrawAskCommand(new AskReference(strtolower($call->id))));

        return $asks->card($reference);
    }
}
