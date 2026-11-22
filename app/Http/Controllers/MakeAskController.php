<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Supervision\MakeAskCall;
use App\Commands\AskSupervisor\AskSupervisorCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Chat\AskReader;
use App\Data\AskCard;

final readonly class MakeAskController
{
    public function __invoke(MakeAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new AskSupervisorCommand($call->body, $call->requestKey->value, $call->typeKey()));

        return $asks->card($reference);
    }
}
