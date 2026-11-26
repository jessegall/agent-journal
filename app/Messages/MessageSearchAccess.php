<?php

declare(strict_types=1);

namespace App\Messages;

use App\Search\Values\OpenAction;
use App\Search\Values\RecordLocation;
use App\Support\ReadToolSearchAccess;
use Illuminate\Support\Str;

/**
 * Who may search messages: an agent whose grant holds messages_read, for the messages it holds it for, and every
 * signed-in user, each limited by the message visibility scope. A hit opens through messages_read with a request key of
 * its own, since reading a message marks it read.
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
