<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Messages\MessageSender;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\ActorProvisioning;
use App\Support\InboxReceiver;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Models\Question;

/**
 * Writes inbox messages and questions for tests the way a send and an ask store them: the actor's own personal inbox,
 * a message under the inbox's next number, and a question to an actor in an inbox.
 */
trait WritesInboxMessages
{
    /**
     * The actor's own inbox, made and joined the first time it is asked for.
     */
    protected function inboxOf(ActorIdentity $actor): Inbox
    {
        $inbox = Inbox::query()->personalTo($actor)->first();

        if ($inbox !== null) {
            return $inbox;
        }

        $this->app->make(ActorProvisioning::class)->provision($actor, 'Own');

        return Inbox::personalOf($actor);
    }

    /**
     * A message the sender posts to the inbox, under the inbox's next number.
     */
    protected function postTo(Inbox $inbox, MessageSender $sender, string $body): Message
    {
        $locked = Inbox::lockedById($inbox->id);
        $number = $locked->takeMessageNumber();

        return Message::create(new InboxReceiver($locked), $number, $sender, $body);
    }

    /**
     * An open question to the actor in its own inbox, which the actor sees and nobody else does.
     */
    protected function askInboxOf(ActorIdentity $recipient, string $body): Question
    {
        $inbox = $this->inboxOf($recipient);

        return Question::create($inbox->id, ActorIdentity::system(), $recipient, $body, QuestionType::Open, []);
    }

    /**
     * An open question in an inbox no actor is attached to, which nobody sees.
     */
    protected function askNobody(string $body): Question
    {
        $inbox = Inbox::create(Inbox::NAMED_PROVIDER, (string) str()->ulid(), 'Nobody');

        return Question::create($inbox->id, ActorIdentity::system(), ActorIdentity::system(), $body, QuestionType::Open, []);
    }
}
