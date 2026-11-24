<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Data\Messages\ChatEventPage;
use App\Exceptions\ChatCursorRefused;

/**
 * A chat's events as the reader's own interval may see them: a first snapshot, then the events after a cursor.
 */
interface ChatTimeline
{
    /**
     * Who is in the chat, the reader's unread count, its newest page and the cursor that continues from the watermark.
     */
    public function snapshot(string $inboxId): ChatEventPage;

    /**
     * The events after the cursor that the reader's interval may see, up to the watermark.
     *
     * @throws ChatCursorRefused
     */
    public function after(string $inboxId, string $cursor): ChatEventPage;
}
