<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * Builds the reading state of one inbox for one agent, with the messages there it has not read.
 */
final class ReadingMessageStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'core.messages.reading';

    /**
     * @param  list<string>  $unreadIds
     */
    public static function forInbox(string $inboxId, string $agentId, array $unreadIds): StateReference
    {
        return self::about(new SubjectReference($inboxId, 0), [
            'inboxId' => $inboxId,
            'agentId' => $agentId,
            'unreadIds' => $unreadIds,
        ]);
    }
}
