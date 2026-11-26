<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Supervision\ShowAskPayload;
use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskCard;
use App\Values\AskReference;

final readonly class ShowAskController
{
    public function __invoke(ShowAskPayload $call, AskReader $asks): AskCard
    {
        return $asks->card(new AskReference(strtolower($call->id)));
    }
}
