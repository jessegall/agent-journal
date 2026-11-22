<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\ShowMessageCall;
use App\Contracts\ConversationResolver;
use App\Data\MessageView;

/**
 * Reads one message.
 */
final readonly class ShowMessageController
{
    public function __invoke(ShowMessageCall $call, ConversationResolver $conversations): MessageView
    {
        return $conversations->detail($call->messageId);
    }
}
