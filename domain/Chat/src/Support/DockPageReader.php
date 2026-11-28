<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Models\Inboxes\Inbox;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\CardEncoder;
use Domain\Chat\Contracts\Docking\DestinationGate;
use Domain\Chat\Contracts\Docking\DockableProvider;
use Domain\Chat\Contracts\Docking\DockRegistry;
use Domain\Chat\Data\DockedSourceData;
use Domain\Chat\Data\DockListData;
use Domain\Chat\Data\DockPageData;
use Domain\Chat\Enums\DockedStatus;
use Domain\Chat\Exceptions\DockCardInvalid;
use Domain\Chat\Exceptions\DockDefinitionInvalid;
use Domain\Chat\Exceptions\PartMapInvalid;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Wire\EncodedCard;
use Illuminate\Container\Container;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Database\Eloquent\Collection;

/**
 * One page of the cards docked in a chat, as the viewer may see them: placements read newest first in
 * batches, each type's cards composed by its owner in one batch, then put back in placement order. A page stops at its
 * card limit, its scan limit or its byte budget, and never says what it left out or why.
 */
final readonly class DockPageReader
{
    public const int CARD_LIMIT = 50;

    public const int LARGEST_CARD_LIMIT = 100;

    public const int SCAN_LIMIT = 100;

    public const int BATCH_LIMIT = 50;

    public const int BYTE_LIMIT = 256 * 1024;

    private const string UNOPENED_CHAT = 'unopened';

    private const int SUMMARY_CHARACTER_LIMIT = 200;

    public function __construct(
        private CurrentActor $actors,
        private DockRegistry $registry,
        private CardEncoder $encoder,
        private DestinationGate $gate,
        private Encrypter $encrypter,
        private Container $container,
    ) {}

    /**
     * One page of the chat's docked sources the actor may read; a chat not yet opened shows none.
     */
    public function page(
        Inbox|null $inbox,
        string|null $token,
        int $limit = self::CARD_LIMIT,
    ): DockPageData {
        $actor = $this->actors->actor();
        $identity = $actor;
        $viewer = "{$identity->type}:{$identity->id}";
        $inboxKey = $inbox === null ? self::UNOPENED_CHAT : $inbox->id;
        $first = DockCursor::start($viewer, $inboxKey);
        $end = DockCursor::end($viewer, $inboxKey);

        $start = $token === null
            ? $first
            : DockCursor::read($this->encrypter, $token, $viewer, $inboxKey)->getOrElse($first);

        if ($inbox === null || $start->hasEnded) {
            return new DockPageData([], $end->token($this->encrypter));
        }

        $context = $this->gate->contextFor($actor);
        $cards = [];
        $bytes = 0;
        $scanned = 0;
        $place = $start;
        $wanted = max(1, min($limit, self::LARGEST_CARD_LIMIT));

        while ($scanned < self::SCAN_LIMIT) {
            $batch = $this->batchAfter($inbox, $place);
            $composed = $this->composed($batch, $context);

            foreach ($batch as $placement) {
                $scanned++;
                $card = $composed->find($placement->source);
                $next = DockCursor::after($viewer, $inboxKey, $placement->assigned_at, $placement->id);

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
     * The cards of records the chat's lines show, by the line that shows each, composed for the actor; a record the
     * actor may not read, or whose owner no longer composes it, has no card.
     *
     * @param  array<string, DockIdentity>  $sources  each record by the key of the line that shows it
     * @return array<string, EncodedCard>
     */
    public function cardsOf(array $sources): array
    {
        $composed = $this->composedSources(array_values($sources), $this->gate->contextFor($this->actors->actor()));
        $cards = [];

        foreach ($sources as $key => $source) {
            foreach ($composed->find($source) as $card) {
                $summary = mb_substr($card->accessibleName, 0, self::SUMMARY_CHARACTER_LIMIT);
                $cards[$key] = $this->encoder->encode($card, $key, $source, $summary);
            }
        }

        return $cards;
    }

    public function of(Inbox $inbox, int $limit): DockListData
    {
        $page = $this->page($inbox, null, $limit);
        $shown = [];

        foreach ($page->cards as $card) {
            $shown[$card->placementId] = $card;
        }

        $placements = DockPlacement::query()
            ->inInbox($inbox)
            ->byAssignedAt()
            ->limit($limit + 1)
            ->get();

        $listed = $placements->take($limit)->map(
            fn (DockPlacement $placement) => self::listed($placement, $shown[$placement->id] ?? null),
        );

        return DockListData::from([
            'inboxId' => $inbox->id,
            'placements' => array_values($listed->all()),
            'hasMore' => $placements->count() > $limit,
        ]);
    }

    /**
     * @return Collection<int, DockPlacement>
     */
    private function batchAfter(Inbox $inbox, DockCursor $place): Collection
    {
        return DockPlacement::query()
            ->inInbox($inbox)
            ->olderThan($place->assignedAt, $place->placementId)
            ->newestAssignedFirst()
            ->limit(self::BATCH_LIMIT)
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
        return $this->composedSources(
            array_values($placements->map(fn (DockPlacement $placement) => $placement->source)->all()),
            $context,
        );
    }

    /**
     * @param  list<DockIdentity>  $sources
     */
    private function composedSources(array $sources, CardContext $context): DockCards
    {
        $cards = new DockCards();

        foreach (collect($sources)->groupBy(fn (DockIdentity $source) => $source->type) as $type => $ofType) {
            try {
                $definition = $this->registry->definition((string) $type);
                /**
                 * @var DockableProvider $provider
                 */
                $provider = $this->container->make($definition->provider);
                $ids = array_values($ofType->map(fn (DockIdentity $source) => $source->id)->all());

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
            return $this->encoder->encode($card, $placement->id, $placement->source, $summary);
        } catch (PartMapInvalid) {
            return new EncodedCard($placement->id, $placement->source, $summary, $summary, null, null);
        }
    }

    private static function listed(DockPlacement $placement, EncodedCard|null $card): DockedSourceData
    {
        return DockedSourceData::from([
            'placementId' => $placement->id,
            'type' => $placement->dockable_type,
            'sourceId' => $placement->dockable_id,
            'title' => $card === null ? '' : $card->accessibleName,
            'status' => $card === null ? DockedStatus::Unavailable : DockedStatus::Shown,
        ]);
    }
}
