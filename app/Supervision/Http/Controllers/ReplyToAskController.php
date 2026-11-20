<?php

declare(strict_types=1);

namespace App\Supervision\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Supervision\Calls\ReplyToAskCall;
use App\Supervision\Commands\ReplyToAsk;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Data\AskCard;
use App\Supervision\Values\AskReference;

final readonly class ReplyToAskController
{
    public function __invoke(ReplyToAskCall $call, AskReader $asks, CommandBus $commands): AskCard
    {
        $reference = $commands->run(new ReplyToAsk(new AskReference(strtolower($call->id)), $call->body));

        return $asks->card($reference);
    }
}
