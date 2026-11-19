<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Support\ActorIdentity;
use App\Desks\Contracts\ReplyInboxes;
use App\Desks\Models\DeskRecord;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Answers with the inbox of the desk the dispatcher forwards to, or of the desk it prefers.
 */
final readonly class DeskReplyInboxes implements ReplyInboxes
{
    public function replyInboxIdFor(ActorIdentity $dispatcher): Option
    {
        $desk = DeskRecord::query()->occupiedBy($dispatcher)->forwarding()->first()
            ?? DeskRecord::preferredBy($dispatcher)->getOrElse(null);

        return $desk === null ? None::create() : Some::create($desk->inbox_id);
    }
}
