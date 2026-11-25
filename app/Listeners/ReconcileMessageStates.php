<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStacks;
use App\Events\Sessions\SessionOpened;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\States\Support\AnswerMessageStateReference;
use App\Support\States\Support\ReadMessageStateReference;

/**
 * A session that opens finds its agent's messages again: each inbox with unread messages since the agent joined gets
 * its reading state, and each message it read but never answered gets its answering state. It also repairs a read
 * committed before its frame was made.
 */
#[InCommandTransaction]
final readonly class ReconcileMessageStates implements Listener
{
    private const int MESSAGE_LIMIT = 100;

    public function __construct(private AgentStacks $stacks) {}

    public function handle(SessionOpened $event): void
    {
        $model = Agent::query()->findOrFail($event->agentId);
        $agent = ActorIdentity::of($model);

        $inboxIds = Message::query()->unreadBy($model)->limit(self::MESSAGE_LIMIT)->pluck('inbox_id')->unique();

        foreach ($inboxIds as $inboxId) {
            $reading = ReadMessageStateReference::forInbox((string) $inboxId, $agent->id);

            $this->stacks->pushFor($agent, $reading);
        }

        $unanswered = Message::query()->unansweredBy($model)->limit(self::MESSAGE_LIMIT)->get();

        foreach ($unanswered as $message) {
            $this->stacks->pushFor($agent, AnswerMessageStateReference::forMessage($message, $agent->id));
        }
    }
}
