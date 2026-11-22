<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Supervision\WithdrawAskCall;
use App\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Chat\AskReader;
use App\Data\AskCard;
use App\Values\AskReference;

final readonly class WithdrawAskController
{
    public function __invoke(WithdrawAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new WithdrawAskCommand(new AskReference(strtolower($call->id))));

        return $asks->card($reference);
    }
}
