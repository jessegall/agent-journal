<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Api\Supervision\MakeAskPayload;
use App\Asks\Commands\AskSupervisor\AskSupervisorCommand;
use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskCard;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;

final readonly class MakeAskController
{
    #[Dispatches(AskSupervisorCommand::class)]
    public function __invoke(MakeAskPayload $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new AskSupervisorCommand($call->body, $call->requestKey->value, $call->typeKey()));

        return $asks->card($reference);
    }
}
