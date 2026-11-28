<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Actors\Contracts\ActorLabels;
use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Hooks\Enums\ContextStartType;
use App\Mcp\Support\McpCatalogue;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Access\User;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use App\Values\AgentText;
use Domain\Chat\Support\PairChats;

/**
 * A new chat is never silent: when an agent's session starts and a chat of it with a user holds nothing yet, its first
 * turn is asked to greet that user there, in its own words, saying who it is and asking how it can help.
 */
final readonly class GreetInNewChat implements Listener
{
    public function __construct(private ActorLabels $labels, private McpCatalogue $tools) {}

    public function handle(ContextStarted $event): void
    {
        if ($event->type !== ContextStartType::Start) {
            return;
        }

        $agent = $event->target->actorReference();

        $chats = Inbox::query()
            ->withProviderKey(PairChats::PAIR_PROVIDER)
            ->ofActiveMemberships($agent)
            ->limit(InboxMember::ATTACHED_LIMIT)
            ->get();

        foreach ($chats as $chat) {
            $this->greetIn($chat, $agent, $event);
        }
    }

    private function greetIn(Inbox $chat, ActorReference $agent, ContextStarted $event): void
    {
        $users = InboxMember::resolveAttachedTo([$chat->id], User::class);

        if ($users === [] || Message::query()->inInbox($chat->id)->exists()) {
            return;
        }

        $names = $this->labels->labelsFor([$agent, ...$users]);

        $event->reminders->add(AgentText::of('chat.greeting', [
            'inbox' => $chat->id,
            'user' => $names->nameOf($users[0]) ?? $users[0]->text(),
            'name' => $names->nameOf($agent) ?? $agent->text(),
            'send' => $this->tools->toolNameDispatching(SendMessageCommand::class),
        ]), true);
    }
}
