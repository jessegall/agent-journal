<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Models\Agents\PendingAgentMessage;
use App\Support\CallStages\WalkedCall;

/**
 * Hands the agent the messages that waited for it, oldest first, before the answer's own reminders, and removes them
 * as they are handed over.
 */
final readonly class HandOverWaitingMessages implements Pipe
{
    public function handle(WalkedCall $walked): WalkedCall
    {
        $agent = $walked->call->target->actorIdentity();
        $waiting = PendingAgentMessage::query()
            ->ownedBy($agent)
            ->orderBy('created_at')
            ->orderBy('id')
            ->lockForUpdate()
            ->limit(PendingAgentMessage::DELIVERY_LIMIT)
            ->get();

        PendingAgentMessage::query()->ownedBy($agent)->whereKey($waiting->modelKeys())->delete();
        $lines = array_values($waiting->flatMap(fn (PendingAgentMessage $message) => $message->lines)->all());

        return $walked->answeredBy($walked->answer->withRemindersFirst($lines));
    }
}
