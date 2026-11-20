<?php

declare(strict_types=1);

namespace App\Supervision\Http\Controllers;

use App\Supervision\Calls\ListAsksCall;
use App\Supervision\Contracts\AskReader;
use App\Supervision\Data\AskInbox;

final readonly class ListAsksController
{
    public function __invoke(ListAsksCall $call, AskReader $asks): AskInbox
    {
        return $asks->inbox($call->cursor());
    }
}
