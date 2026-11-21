<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Communication\Models\Message;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;

/**
 * Messages as claimable records: Core's message claims assign them, and a message that no longer waits is over.
 */
final readonly class MessageClaimProvider implements AssignableProvider
{
    public function requireAssignable(RecordIdentity $record): Assignable
    {
        return Message::query()->acrossInboxes()->whereKey($record->id)->lock('for key share')->firstOr(
            fn () => throw RecordUnavailable::for($record),
        );
    }

    public function visibleRecords(array $records): array
    {
        $found = Message::query()
            ->whereKey(array_map(fn (RecordIdentity $record) => $record->id, $records))
            ->readExactly(count($records))
            ->pluck('id')
            ->all();

        return RecordIdentity::among($records, $found);
    }

    public function finishedRecords(array $records): array
    {
        $over = array_filter(
            $records,
            fn (Assignable $message) => $message instanceof Message && ! $message->needsReply(),
        );

        return array_values(array_map(fn (Assignable $message) => $message->assignmentIdentity(), $over));
    }
}
