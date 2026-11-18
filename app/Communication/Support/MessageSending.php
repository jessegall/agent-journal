<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\ActorWake;
use App\Communication\Commands\AskMessage;
use App\Communication\Commands\SendMessage;
use App\Communication\Contracts\MessageAddressReader;
use App\Communication\Events\MessageSent;
use App\Communication\Models\Message;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * The one path every send, ask and reply takes (doc 27 revision 5, section 11): the sender comes from the request, the
 * recipient is checked, a resent submission answers with the message it made, and a new message wakes its recipient
 * in the same transaction. Nothing is pushed onto anyone's stack here: the recipient takes the work up itself.
 */
final readonly class MessageSending
{
    public function __construct(
        private MessageAddressReader $addresses,
        private SubmissionReplay $replay,
        private ActorWake $wake,
        private Dispatcher $events,
    ) {}

    public function send(ActorIdentity $recipient, string $text, string $submissionKey): string
    {
        $sender = ActorIdentity::of($this->addresses->sender());
        $to = ActorIdentity::of($this->addresses->recipient($recipient));
        $body = MessageBody::from($text);
        $submission = Submission::of($submissionKey, SendMessage::class, $to, null, $body);

        return $this->store(MessageEnvelope::send($sender, $to, $body, $submission), static fn (Message $sent) => null);
    }

    public function ask(ActorIdentity $recipient, string $text, string $submissionKey): string
    {
        $sender = $this->addresses->sender();
        $to = $this->addresses->recipient($recipient);
        $body = MessageBody::from($text);
        $submission = Submission::of($submissionKey, AskMessage::class, ActorIdentity::of($to), null, $body);
        $envelope = MessageEnvelope::ask($sender, $to, $body, $submission);

        return $this->store($envelope, static fn (Message $asked) => $asked->requireAnswer());
    }

    /**
     * A reply to a message: it goes back to that message's sender, and the message it answers is told by the caller.
     */
    public function reply(Message $original, string $text, string $submissionKey, Closure $settle): string
    {
        $sender = ActorIdentity::of($this->addresses->sender());
        $to = $original->sender();
        $body = MessageBody::from($text);
        $submission = Submission::of($submissionKey, 'reply', $to, $original->id, $body);

        return $this->store(MessageEnvelope::send($sender, $to, $body, $submission, $original->id), $settle);
    }

    /**
     * @param  Closure(Message): void  $settle  what the new message also is, such as a question waiting for its answer
     */
    private function store(MessageEnvelope $envelope, Closure $settle): string
    {
        $earlier = $this->replay->earlier($envelope->sender, $envelope->submission);
        if ($earlier !== null) {
            return $earlier;
        }

        $message = Message::record($envelope);
        $settle($message);
        $message->recordWake($this->wake->wake($envelope->recipient, "message:{$message->id}"));
        $this->events->dispatch(new MessageSent($message->id, $envelope->sender, $envelope->recipient));

        return $message->id;
    }
}
