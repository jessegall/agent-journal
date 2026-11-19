<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Links\Models\Link;
use App\Reads\Support\ScopedReadMeter;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Sharing\Exceptions\ShareBudgetExceeded;
use App\Sharing\Exceptions\ShareScopeTooLarge;
use App\Sharing\Exceptions\UnknownShareRecordType;

/**
 * Finds what a share of a root could include, for the owner's preview: the root's card from its own provider, then
 * the records linked to it through each linked relation, read by their own providers in batches of at most 100 per
 * provider, and so on from those records up to the budget's hops. A target whose type advertises none of the needed
 * capabilities, or whose provider calls it ineligible, is dropped without its title. The batches repeat their reads
 * on purpose and are bounded by the budget. Owned children are not candidates: their parent's provider reads them
 * live.
 */
final readonly class ShareScope
{
    private const int TARGET_BATCH = 100;

    public function __construct(private ShareRecordRegistry $records) {}

    /**
     * @throws UnknownShareRecordType when the root's type is not registered for sharing
     * @throws RecordUnavailable when the root is missing or may not be disclosed
     * @throws ShareScopeTooLarge when finding the candidates would pass the budget
     */
    public function discover(RecordIdentity $root, MeteredShareBudget $budget): ShareCandidates
    {
        $provider = $this->records->provider($root->type);

        try {
            if (! $budget->run(fn () => $provider->mayDisclose($root))) {
                throw RecordUnavailable::forActor($root);
            }

            $card = $budget->run(fn () => $provider->preview(new ShareSelection($root, []), $budget));

            $linked = ScopedReadMeter::ofCurrentScope()->withinSchedule(
                'share scope batches',
                fn () => $this->linkedFrom($root, $budget),
            );

            return new ShareCandidates($card, $linked);
        } catch (ShareBudgetExceeded $exceeded) {
            throw ShareScopeTooLarge::because($exceeded);
        }
    }

    /**
     * @return list<ShareLinkedCandidate>
     *
     * @throws ShareBudgetExceeded
     */
    private function linkedFrom(RecordIdentity $root, MeteredShareBudget $budget): array
    {
        $found = [];
        $seen = [$this->key($root)];
        $sources = [$root];

        for ($hops = 1; $sources !== []; $hops++) {
            $next = [];

            foreach ($sources as $source) {
                $capabilities = $this->records->relations($source->type)->linkedCapabilities();

                if ($capabilities === []) {
                    continue;
                }

                $budget->requireHops($hops);

                foreach ($this->candidatesOf($source, $capabilities, $budget, $seen) as $candidate) {
                    $found[] = $candidate;
                    $next[] = $candidate->card->record;
                    $seen[] = $this->key($candidate->card->record);
                }
            }

            $sources = $next;
        }

        return $found;
    }

    /**
     * The disclosable records linked to the source whose type advertises one of the capabilities, read in one batch
     * per provider page. Every record on the other side of a link is charged, the dropped ones too.
     *
     * @param  list<string>  $capabilities
     * @param  list<string>  $seen
     * @return list<ShareLinkedCandidate>
     *
     * @throws ShareBudgetExceeded
     */
    private function candidatesOf(
        RecordIdentity $source,
        array $capabilities,
        MeteredShareBudget $budget,
        array $seen,
    ): array {
        $links = $budget->run(
            fn () => Link::query()->touchingKey(
                $source->type,
                $source->id,
            )->orderBy('id')->readLimit($budget->mostLinks + 1)->get(),
        );
        $budget->chargeLinks($links->count());
        $budget->chargeRecords($links->count());
        $linkOfTarget = [];

        foreach ($links as $link) {
            [$type, $id] = $link->otherSideFromKey($source->type, $source->id);
            $target = new RecordIdentity($type, $id);

            if (! in_array($this->key($target), $seen, true) && $this->records->has($type) && $this->records->get($type)->advertisesAnyOf($capabilities)) {
                $linkOfTarget[$type][$id] = $link->id;
            }
        }

        $candidates = [];

        foreach ($linkOfTarget as $type => $linkOfId) {
            foreach (array_chunk(array_keys($linkOfId), self::TARGET_BATCH) as $ids) {
                $targets = array_map(fn (string $id) => new RecordIdentity($type, $id), $ids);

                foreach ($this->eligibleCards($source, $type, $targets, $budget) as $card) {
                    if ($card->record->type === $type && array_key_exists($card->record->id, $linkOfId)) {
                        $candidates[] = new ShareLinkedCandidate($card, $source, $linkOfId[$card->record->id]);
                    }
                }
            }
        }

        return $candidates;
    }

    /**
     * The cards the provider of the type calls eligible among one batch of targets, page after page.
     *
     * @param  list<RecordIdentity>  $targets
     * @return list<ShareRecordCard>
     *
     * @throws ShareBudgetExceeded
     */
    private function eligibleCards(
        RecordIdentity $source,
        string $type,
        array $targets,
        MeteredShareBudget $budget,
    ): array {
        $provider = $this->records->provider($type);
        $cards = [];
        $continuation = null;

        do {
            $read = new ShareTargetRead([$source], $targets, $continuation);
            $page = $budget->run(fn () => $provider->readTargets($read, $budget));
            array_push($cards, ...$page->eligible);
            $continuation = $page->continuation;
        } while ($page->hasMore());

        return $cards;
    }

    private function key(RecordIdentity $record): string
    {
        return "{$record->type}:{$record->id}";
    }
}
