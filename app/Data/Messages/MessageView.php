<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Enums\MessageState;
use App\Models\Messages\Message;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A message as a reader sees it: between which inboxes and by whom, its text and state, who first read it and who has
 * taken it up. A message nobody read has no first reader, and one nobody holds has no claim holder.
 */
#[TypeScript]
final class MessageView extends Data
{
    /**
     * The type a message is linked and docked under.
     */
    public const string LINK_TYPE = Message::LINK_TYPE;

    public function __construct(
        public readonly string $id,
        public readonly string $sourceInboxId,
        public readonly string $sourceInboxLabel,
        public readonly string $destinationInboxId,
        public readonly string $destinationInboxLabel,
        public readonly string $authorType,
        public readonly string $authorId,
        public readonly string|null $authorLabel,
        public readonly string $body,
        public readonly MessageState $state,
        public readonly int $stateVersion,
        public readonly string|null $replyToId,
        public readonly string|null $answerId,
        public readonly MessageReader|Optional $firstReader,
        public readonly MessageClaimHolder|Optional $claimHolder,
        public readonly string $sentAt,
        // The key the viewer sent this message under; only its own sender sees it, every other viewer reads null.
        public readonly string|null $requestKey,
        // A chat reply whose parent the viewer may not see names no parent and says it is unavailable.
        public readonly bool $replyUnavailable = false,
        // A chat row's timeline position, the user message it belongs under when the viewer may see it, whom it
        // addresses, and whether it was shown to the viewer; a desk message has none of them.
        public readonly int|null $sequence = null,
        public readonly string|null $userRootId = null,
        public readonly string|null $addresseeType = null,
        public readonly string|null $addresseeId = null,
        public readonly bool $shownToViewer = false,
        public readonly string|null $respondentType = null,
        public readonly string|null $respondentId = null,
    ) {}
}
