<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Data\MessageView;
use App\Communication\Exceptions\MessageMissing;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\PinnableMessages;

/**
 * The asker's pins, newest first, as the messages they point at; a pin whose message the asker can no longer read is
 * left out but kept, so it comes back with access.
 */
final readonly class MessagePinRecords
{
    public function __construct(
        private CurrentActor $actors,
        private PinnableMessages $pinnable,
    ) {}

    /**
     * @return list<MessageView>
     */
    public function pinned(int $limit = MessagePin::DEFAULT_LIMIT): array
    {
        $pins = MessagePin::query()
            ->ownedBy(ActorIdentity::of($this->actors->actor()))
            ->orderByDesc('pinned_at')
            ->orderByDesc('id')
            ->readExactly(max(1, min($limit, MessagePin::LARGEST_LIMIT)))
            ->get();
        $views = [];

        foreach ($pins as $pin) {
            try {
                $views[] = $this->pinnable->requireIn($pin->conversation(), $pin->message_id);
            } catch (MessageMissing) {
                continue;
            }
        }

        return $views;
    }
}
