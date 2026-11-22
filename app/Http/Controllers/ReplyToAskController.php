<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Supervision\ReplyToAskCall;
use App\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Contracts\AskReader;
use App\Contracts\CommandBus;
use App\Data\AskCard;
use App\Values\AskReference;

final readonly class ReplyToAskController
{
    public function __invoke(ReplyToAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new ReplyToAskCommand(new AskReference(strtolower($call->id)), $call->body));

        return $asks->card($reference);
    }
}
