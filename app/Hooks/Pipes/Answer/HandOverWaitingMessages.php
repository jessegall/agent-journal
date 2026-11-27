<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\WalkedCall;
use App\Models\Agents\PendingAgentMessage;

/**
 * Hands the agent the messages that waited for it, oldest first, before the answer's own reminders, and removes them
 * as they are handed over.
 */
final readonly class HandOverWaitingMessages implements Pipe
{
    public function handle(WalkedCall $walked): WalkedCall
    {
        $agent = $walked->agent();

        $waiting = PendingAgentMessage::query()
            ->ownedBy($agent)
            ->byCreatedAt()
            ->lockForUpdate()
            ->limit(PendingAgentMessage::DELIVERY_LIMIT)
            ->get();

        PendingAgentMessage::query()->ownedBy($agent)->whereKey($waiting->modelKeys())->delete();
        $lines = array_values($waiting->flatMap(fn (PendingAgentMessage $message) => $message->lines)->all());

        return $walked->answeredBy($walked->answer->withRemindersFirst($lines));
    }
}
