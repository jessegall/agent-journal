<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Supervision\ShowAskCall;
use App\Contracts\Chat\AskReader;
use App\Data\Asks\AskCard;
use App\Values\AskReference;

final readonly class ShowAskController
{
    public function __invoke(ShowAskCall $call, AskReader $asks): AskCard
    {
        return $asks->card(new AskReference(strtolower($call->id)));
    }
}
