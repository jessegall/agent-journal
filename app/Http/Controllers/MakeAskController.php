<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Supervision\MakeAskCall;
use App\Commands\AskSupervisor\AskSupervisorCommand;
use App\Contracts\AskReader;
use App\Contracts\CommandBus;
use App\Data\AskCard;

final readonly class MakeAskController
{
    public function __invoke(MakeAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new AskSupervisorCommand($call->body, $call->requestKey->value, $call->typeKey()));

        return $asks->card($reference);
    }
}
