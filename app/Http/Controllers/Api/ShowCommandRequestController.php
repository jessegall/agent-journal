<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\CommandRules\CommandRequestViews;
use App\Processes\Api\CommandRequestShown;
use App\Processes\Api\ShowCommandRequestPayload;

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
