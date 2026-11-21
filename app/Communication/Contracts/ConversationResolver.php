<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Communication\Data\InboxCounts;
use App\Communication\Data\InboxView;
use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageView;
use App\Communication\Data\WakeStatus;
use App\Communication\Exceptions\MessageMissing;

/**
 * Reads messages as the current actor may see them, in bounded pages, oldest first within a page; reading never
 * marks anything read.
 */
interface ConversationResolver
{
    /**
     * @throws MessageMissing
     */
    public function detail(string $messageId): MessageView;

    /**
     * Whether the current actor may see the message now.
     */
    public function canSee(string $messageId): bool;

    /**
     * The messages between two inboxes, both ways, older than the cursor.
     */
    public function between(
        string $firstInboxId,
        string $secondInboxId,
        string|null $olderCursor,
        int $limit,
    ): MessagePage;

    /**
     * An inbox's whole history, incoming and outgoing, older than the cursor.
     */
    public function history(string $inboxId, string|null $olderCursor, int $limit): MessagePage;

    public function counts(string $inboxId): InboxCounts;

    /**
     * An inbox's whole history as an admitted inspector reads it, whether or not the inspector sits there; it marks
     * nothing read and takes nothing up.
     *
     * @throws ActorNotAllowed
     */
    public function inspect(string $inboxId, string|null $olderCursor, int $limit): MessagePage;

    /**
     * Whether the reader sits at the inbox now, so its history is the reader's own rather than an inspection.
     */
    public function sitsAt(string $inboxId): bool;

    /**
     * The inboxes the reader sits at now, each with its counts; reading them marks nothing read.
     *
     * @return list<InboxView>
     */
    public function ownInboxes(): array;

    /**
     * For the message's author only: whether each notified member's runtime accepted the wake.
     *
     * @return list<WakeStatus>
     *
     * @throws MessageMissing
     */
    public function wakeStatus(string $messageId): array;
}
