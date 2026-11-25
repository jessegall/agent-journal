<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Supervision\ReplyToAskPayload;
use App\Commands\Asks\ReplyToAsk\ReplyToAskCommand;
use App\Contracts\Asks\AskReader;
use App\Contracts\Bus\CommandBus;
use App\Data\Asks\AskCard;
use App\Values\AskReference;

final readonly class ReplyToAskController
{
    public function __invoke(ReplyToAskPayload $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new ReplyToAskCommand(new AskReference(strtolower($call->id)), $call->body));

        return $asks->card($reference);
    }
}
