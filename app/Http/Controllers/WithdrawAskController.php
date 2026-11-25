<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Supervision\WithdrawAskPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\Asks\WithdrawAsk\WithdrawAskCommand;
use App\Contracts\Asks\AskReader;
use App\Contracts\Bus\CommandBus;
use App\Data\Asks\AskCard;
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
