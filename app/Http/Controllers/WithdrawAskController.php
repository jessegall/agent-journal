<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Supervision\WithdrawAskCall;
use App\Commands\Asks\WithdrawAsk\WithdrawAskCommand;
use App\Contracts\Asks\AskReader;
use App\Contracts\Bus\CommandBus;
use App\Data\Asks\AskCard;
use App\Values\AskReference;

final readonly class WithdrawAskController
{
    public function __invoke(WithdrawAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new WithdrawAskCommand(new AskReference(strtolower($call->id))));

        return $asks->card($reference);
    }
}
