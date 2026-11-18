<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Tests\Fixtures\Names\Chat\ChatFailed;
use Tests\Fixtures\Names\Chat\Message;
use Tests\Fixtures\Names\Chat\Notifier;

/**
 * Keeps messages until someone reads them.
 *
 * @template TMessage of Message
 *
 * @property-read Notifier $notifier
 *
 * @method Message latest()
 */
final class DocblockTypes
{
    /**
     * @var list<Message>
     */
    public array $messages = [];

    /**
     * @param  array{message: Message, count: int}  $shape
     * @return Message|Notifier|null
     *
     * @throws ChatFailed
     */
    public function first(array $shape): object|null
    {
        if ($shape['count'] < 0) {
            throw new ChatFailed;
        }

        if ($shape['count'] === 0) {
            return null;
        }

        /** @var Message $message */
        $message = $shape['message'];

        return $message;
    }

    /**
     * @return Message
     */
    public function fullyWritten(): object
    {
        return new Message;
    }
}
