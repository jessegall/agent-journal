<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\CommandRequestShown;
use App\Api\Processes\ShowCommandRequestPayload;
use App\Support\CommandRequestViews;

/**
 * Shows a held command request with its proposals and readers.
 */
final readonly class ShowCommandRequestController
{
    public function __invoke(ShowCommandRequestPayload $call, CommandRequestViews $requests): CommandRequestShown
    {
        return $requests->show($call->commandRequest);
    }
}
