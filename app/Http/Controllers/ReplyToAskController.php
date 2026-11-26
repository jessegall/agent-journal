<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Supervision\ReplyToAskPayload;
use App\Asks\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskCard;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Values\AskReference;

final readonly class ReplyToAskController
{
    #[Dispatches(ReplyToAskCommand::class)]
    public function __invoke(ReplyToAskPayload $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new ReplyToAskCommand(new AskReference(strtolower($call->id)), $call->body));

        return $asks->card($reference);
    }
}
