<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Supervision\ListAsksCall;
use App\Contracts\AskReader;
use App\Data\AskInbox;

final readonly class ListAsksController
{
    public function __invoke(ListAsksCall $call, AskReader $asks): AskInbox
    {
        return $asks->inbox($call->cursor());
    }
}
