<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\ReadWakeStatusCall;
use App\Calls\Communication\WakeStatuses;
use App\Contracts\Chat\ConversationResolver;
use App\Data\WakeStatus;

/**
 * Answers whether each notified member's runtime accepted the message's wake.
 */
final readonly class ReadWakeStatusController
{
    public function __invoke(ReadWakeStatusCall $call, ConversationResolver $conversations): WakeStatuses
    {
        $members = array_map(
            fn (WakeStatus $status) => [
                'actorType' => $status->actorType,
                'actorId' => $status->actorId,
                'requestId' => $status->requestId,
            ],
            $conversations->wakeStatus($call->messageId),
        );

        return WakeStatuses::from(['members' => $members]);
    }
}
