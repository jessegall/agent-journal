<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Who may search chat messages: an agent whose grant holds messages_read, limited to the messages it holds it for,
 * and every signed-in user; which messages each sees is the message visibility scope's answer, applied on every
 * read. A hit opens through messages_read by its visible id.
 */
final readonly class MessageSearchAccess extends ReadToolSearchAccess
{
    public const string READ = 'messages_read';

    public const string ID_ARGUMENT = 'message_id';

    protected function readName(): string
    {
        return self::READ;
    }

    protected function idArgument(): string
    {
        return self::ID_ARGUMENT;
    }
}
