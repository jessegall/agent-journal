<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Data\Notifications\NotificationDestination;
use App\Data\Notifications\NotificationItem;
use App\Data\Notifications\NotificationLink;
use App\Data\Notifications\NotificationPage;
use App\Exceptions\NotificationCursorInvalid;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Support\ActorIdentity;
use App\Support\NotificationCursor;
use App\Support\NotificationScopes;
use App\Support\NotificationTargets;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Optional;

/**
 * Reads the actor's notifications newest first by sequence, twenty to a page, each target authorized again on every
 * read. The unread count is the scope's own counter, never a count of rows; hidden receipts never show.
 */
final readonly class NotificationFeed
{
    public function __construct(
        private NotificationScopes $scopes,
        private NotificationTargets $targets,
    ) {}

    /**
     * @throws NotificationCursorInvalid
     */
    public function page(ActorIdentity $actor, string|null $cursor): NotificationPage
    {
        return NotificationScope::findFor($this->scopes->keyFor($actor), $actor)
            ->map(fn (NotificationScope $scope) => $this->pageOf($scope, $cursor))
            ->getOrCall(fn () => new NotificationPage(null, '0', 0, null, null, []));
    }

    private function pageOf(NotificationScope $scope, string|null $cursor): NotificationPage
    {
        $before = $cursor === null ? null : NotificationCursor::read($cursor, $scope->id)->beforeSequence;
        $examined = NotificationReceipt::findVisibleInScope($scope->id, $before, NotificationPage::SIZE + 1);
        $receipts = array_slice($examined, 0, NotificationPage::SIZE);
        $last = end($receipts);
        $hasOlder = count($examined) > NotificationPage::SIZE && $last !== false;

        return new NotificationPage(
            $receipts === [] ? null : (string) $receipts[0]->sequence,
            (string) $scope->mutation_version,
            $scope->unread_count,
            $hasOlder ? NotificationCursor::at($scope->id, $last->sequence)->text() : null,
            NotificationChanges::cursorAt($scope),
            array_values($this->itemsOf($receipts)),
        );
    }

    /**
     * The receipt as the actor may see it now, reauthorized against its target: none when it is hidden or its
     * target may not even be named, a generic unavailable item when the target is gone but may be.
     *
     * @param  array<string, array<int|string, NotificationLink>>  $links  by target key, then target id
     * @return Option<NotificationItem>
     */
    private function itemOf(NotificationReceipt $receipt, array $links): Option
    {
        $occurrence = $receipt->occurrence;
        $resolver = $this->targets->resolverFor($occurrence->target_key);
        $link = Option::fromArraysValue($links[$occurrence->target_key] ?? [], $occurrence->target_id);

        if ($receipt->isHidden() || ($link->isEmpty() && ! $resolver->disclosesMissing())) {
            return None::create();
        }

        return new Some(new NotificationItem(
            $receipt->id,
            $receipt->sequence,
            $receipt->read_at?->toIso8601String(),
            $link->map(fn (NotificationLink $found) => $found->title)
                ->getOrElse(NotificationItem::UNAVAILABLE_TITLE),
            $link->map(fn (NotificationLink $found) => new NotificationDestination(
                $occurrence->target_key,
                $occurrence->target_id,
                $found->url,
            ))->getOrElse(Optional::create()),
        ));
    }

    /**
     * The items the actor may see, in order: each target's links read once for all the receipts that name it.
     *
     * @param  list<NotificationReceipt>  $receipts
     * @return array<string, NotificationItem> by receipt id
     */
    public function itemsOf(array $receipts): array
    {
        $idsByKey = [];

        foreach ($receipts as $receipt) {
            $idsByKey[$receipt->occurrence->target_key][] = $receipt->occurrence->target_id;
        }

        $links = [];

        foreach ($idsByKey as $key => $ids) {
            $links[$key] = $this->targets->resolverFor($key)->linksFor(array_values(array_unique($ids)));
        }

        $items = [];

        foreach ($receipts as $receipt) {
            $this->itemOf($receipt, $links)->forAll(function (NotificationItem $item) use (&$items, $receipt): void {
                $items[$receipt->id] = $item;
            });
        }

        return $items;
    }
}
