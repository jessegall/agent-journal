<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Supervision\ListAsksPayload;
use App\Asks\Contracts\AskReader;
use App\Asks\Data\AskInbox;

final readonly class ListAsksController
{
    public function __invoke(ListAsksPayload $call, AskReader $asks): AskInbox
    {
        return $asks->inbox($call->cursor());
    }
}
