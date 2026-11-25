<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use App\Events\Sessions\SessionOpened;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\States\Support\AnsweringMessageStateReference;
use App\Support\States\Support\ReadingMessageStateReference;

/**
 * A session that opens finds its agent's messages again: each inbox with unread messages since the agent joined gets
 * its reading state, and each message it read but never answered gets its answering state. It also repairs a read
 * committed before its frame was made.
 */
#[InCommandTransaction]
final readonly class ReconcileMessageStates implements Listener
{
    private const int MESSAGE_LIMIT = 200;

    public function __construct(private AgentStack $stacks) {}

    public function handle(SessionOpened $event): void
    {
        $model = Agent::query()->findOrFail($event->agentId);
        $agent = ActorIdentity::of($model);

        $unread = Message::query()->unreadBy($model)->limit(self::MESSAGE_LIMIT)->get([
            'id',
            'inbox_id',
        ]);

        foreach ($unread->groupBy('inbox_id') as $inboxId => $messages) {
            $this->stacks->pushFor($agent, ReadingMessageStateReference::forInbox(
                (string) $inboxId,
                $agent->id,
                array_values($messages->modelKeys()),
            ));
        }

        $unanswered = Message::query()->unansweredBy($model)->limit(self::MESSAGE_LIMIT)->get();

        foreach ($unanswered as $message) {
            $this->stacks->pushFor($agent, AnsweringMessageStateReference::forMessage($message, $agent->id));
        }
    }
}
