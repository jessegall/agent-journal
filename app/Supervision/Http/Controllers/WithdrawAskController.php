<?php

declare(strict_types=1);

namespace App\Supervision\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Supervision\Calls\WithdrawAskCall;
use App\Supervision\Commands\WithdrawAsk;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Data\AskCard;
use App\Supervision\Values\AskReference;

final readonly class WithdrawAskController
{
    public function __invoke(WithdrawAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new WithdrawAsk(new AskReference(strtolower($call->id))));

        return $asks->card($reference);
    }
}
