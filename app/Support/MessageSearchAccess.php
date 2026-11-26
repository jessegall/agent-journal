<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\OpenAction;
use App\Values\RecordLocation;
use Illuminate\Support\Str;

/**
 * Who may search messages: an agent whose grant holds messages_read, limited to the messages it holds it for,
 * and every signed-in user; which messages each sees is the message visibility scope's answer, applied on every
 * read. A hit opens through messages_read by its visible id, with a request key of its own, since reading a
 * message marks it read.
 */
final readonly class MessageSearchAccess extends ReadToolSearchAccess
{
    public const string READ = 'messages_read';

    public const string ID_ARGUMENT = 'message_id';

    private const string REQUEST_KEY_ARGUMENT = 'request_key';

    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        $requestKey = Str::ulid()->toString();

        return new OpenAction(self::READ, [self::ID_ARGUMENT => $recordId, self::REQUEST_KEY_ARGUMENT => $requestKey]);
    }

    protected function readName(): string
    {
        return self::READ;
    }

    protected function idArgument(): string
    {
        return self::ID_ARGUMENT;
    }
}
