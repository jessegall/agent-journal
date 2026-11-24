<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\CommandRequestShown;
use App\Calls\Processes\ShowCommandRequestCall;
use App\Support\CommandRequestViews;

/**
 * Shows a held command request with its proposals and readers.
 */
final readonly class ShowCommandRequestController
{
    public function __invoke(ShowCommandRequestCall $call, CommandRequestViews $requests): CommandRequestShown
    {
        return $requests->show($call->commandRequest);
    }
}
