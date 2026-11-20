<?php

declare(strict_types=1);

namespace App\Supervision\Http\Controllers;

use App\Supervision\Calls\ShowAskCall;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Data\AskCard;
use App\Supervision\Values\AskReference;

final readonly class ShowAskController
{
    public function __invoke(ShowAskCall $call, AskReader $asks): AskCard
    {
        return $asks->card(new AskReference(strtolower($call->id)));
    }
}
