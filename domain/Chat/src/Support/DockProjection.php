<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Docking\Cards\DockCard;
use App\Docking\Exceptions\DockCardInvalid;
use App\Docking\Exceptions\DockDefinitionInvalid;
use App\Docking\Exceptions\PartMapInvalid;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\DestinationGate;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\Contracts\DockRegistration;
use App\Docking\Wire\Contracts\CardEncoder;
use App\Docking\Wire\EncodedCard;
use Domain\Chat\Data\DockPageData;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DockPlacement;
use Illuminate\Container\Container;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Database\Eloquent\Collection;

/**
 * One page of the cards docked in a conversation, as the viewer may see them: placements read newest first in
 * batches, each type's cards composed by its owner in one batch, then put back in placement order. A page stops at its
 * card limit, its scan limit or its byte budget, and never says what it left out or why.
 */
final readonly class DockProjection
{
    public const int CARD_LIMIT = 50;

    public const int LARGEST_CARD_LIMIT = 100;

    public const int SCAN_LIMIT = 100;

    public const int BATCH_LIMIT = 50;

    public const int BYTE_LIMIT = 256 * 1024;

    private const int SUMMARY_CHARACTER_LIMIT = 200;

    public function __construct(
        private CurrentActor $actors,
        private DockRegistration $registry,
        private CardEncoder $encoder,
        private DestinationGate $gate,
        private Encrypter $encrypter,
        private Container $container,
    ) {}

    public function page(ConversationPeers $peers, string|null $token, int $limit = self::CARD_LIMIT): DockPageData
    {
        $actor = $this->actors->actor();
        $identity = ActorIdentity::of($actor);
        $viewer = "{$identity->type->value}:{$identity->id}";
        $conversation = $peers->existingConversation();
        $conversationKey = $conversation === null ? "{$peers->ownInboxId}:{$peers->peerInboxId}" : $conversation->id;
        $first = DockCursor::start($viewer, $conversationKey);
        $end = DockCursor::end($viewer, $conversationKey);
        $start = $token === null
            ? $first
            : DockCursor::read($this->encrypter, $token, $viewer, $conversationKey)->getOrElse($first);

        if ($conversation === null || $start->ended) {
            return new DockPageData([], $end->token($this->encrypter));
        }

        $context = $this->gate->contextFor($actor);
        $cards = [];
        $bytes = 0;
        $scanned = 0;
        $place = $start;
        $wanted = max(1, min($limit, self::LARGEST_CARD_LIMIT));

        while ($scanned < self::SCAN_LIMIT) {
            $batch = $this->batchAfter($conversation, $place);
            $composed = $this->composed($batch, $context);

            foreach ($batch as $placement) {
                $scanned++;
                $card = $composed->find($placement->source());
                $next = DockCursor::after($viewer, $conversationKey, $placement->assigned_at, $placement->id);

                if ($card->isEmpty()) {
                    $place = $next;

                    continue;
                }

                $encoded = $this->encoded($card->get(), $placement);
                $size = strlen((string) json_encode($encoded));

                if ($bytes + $size > self::BYTE_LIMIT) {
                    return new DockPageData($cards, $place->token($this->encrypter));
                }

                $cards[] = $encoded;
                $bytes += $size;
                $place = $next;

                if (count($cards) === $wanted) {
                    return new DockPageData($cards, $place->token($this->encrypter));
                }
            }

            if ($batch->count() < self::BATCH_LIMIT) {
                return new DockPageData($cards, $end->token($this->encrypter));
            }
        }

        return new DockPageData($cards, $place->token($this->encrypter));
    }

    /**
     * @return Collection<int, DockPlacement>
     */
    private function batchAfter(Conversation $conversation, DockCursor $place): Collection
    {
        return DockPlacement::query()
            ->inConversation($conversation)
            ->olderThan($place->assignedAt, $place->placementId)
            ->orderByDesc('assigned_at')
            ->orderByDesc('id')
            ->readExactly(self::BATCH_LIMIT)
            ->get();
    }

    /**
     * Each type's cards composed by its owner, one batch per type; a type no longer registered, or an owner that
     * composes a card against the card language, shows none of its cards.
     *
     * @param  Collection<int, DockPlacement>  $placements
     */
    private function composed(Collection $placements, CardContext $context): DockCards
    {
        $cards = new DockCards();

        foreach ($placements->groupBy('dockable_type') as $type => $ofType) {
            try {
                $definition = $this->registry->definition((string) $type);
                /**
                 * @var DockableProvider $provider
                 */
                $provider = $this->container->make($definition->provider);
                $ids = array_values($ofType->map(fn (DockPlacement $placement) => $placement->dockable_id)->all());

                foreach ($provider->cardsFor($definition, $ids, $context) as $composed) {
                    $cards->add($composed);
                }
            } catch (DockDefinitionInvalid|DockCardInvalid) {
                continue;
            }
        }

        return $cards;
    }

    private function encoded(DockCard $card, DockPlacement $placement): EncodedCard
    {
        $summary = mb_substr($card->accessibleName, 0, self::SUMMARY_CHARACTER_LIMIT);

        try {
            return $this->encoder->encode($card, $placement->id, $placement->source(), $summary);
        } catch (PartMapInvalid) {
            return new EncodedCard($placement->id, $placement->source(), $summary, $summary, null, null);
        }
    }
}
