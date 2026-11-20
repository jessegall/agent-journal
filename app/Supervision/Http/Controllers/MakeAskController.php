<?php

declare(strict_types=1);

namespace App\Supervision\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Supervision\Calls\MakeAskCall;
use App\Supervision\Commands\AskSupervisor;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Data\AskCard;

final readonly class MakeAskController
{
    public function __invoke(MakeAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new AskSupervisor($call->body, $call->requestKey->value, $call->typeKey()));

        return $asks->card($reference);
    }
}
