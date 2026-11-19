<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Communication\Data\InboxCounts;
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
     * For the message's author only: whether each notified member's runtime accepted the wake.
     *
     * @return list<WakeStatus>
     *
     * @throws MessageMissing
     */
    public function wakeStatus(string $messageId): array;
}
