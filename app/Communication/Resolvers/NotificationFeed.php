<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Data\NotificationDestination;
use App\Communication\Data\NotificationItem;
use App\Communication\Data\NotificationLink;
use App\Communication\Data\NotificationPage;
use App\Communication\Exceptions\NotificationCursorInvalid;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use App\Communication\Support\NotificationCursor;
use App\Communication\Support\NotificationScopes;
use App\Communication\Support\NotificationTargetRegistry;
use Spatie\LaravelData\Optional;

/**
 * Reads the actor's notifications newest first by sequence, twenty to a page, each target authorized again on every
 * read. The unread count is the scope's own counter, never a count of rows; hidden receipts never show.
 */
final readonly class NotificationFeed
{
    public function __construct(
        private NotificationScopes $scopes,
        private NotificationTargetRegistry $targets,
    ) {}

    /**
     * @throws NotificationCursorInvalid
     */
    public function page(ActorIdentity $actor, string|null $cursor): NotificationPage
    {
        return NotificationScope::findFor($this->scopes->keyFor($actor), $actor)
            ->map(fn (NotificationScope $scope) => $this->pageOf($scope, $cursor))
            ->getOrCall(fn () => new NotificationPage(null, '0', 0, null, []));
    }

    private function pageOf(NotificationScope $scope, string|null $cursor): NotificationPage
    {
        $before = $cursor === null ? null : NotificationCursor::read($cursor, $scope->id)->beforeSequence;
        $examined = NotificationReceipt::visibleInScope($scope->id, $before, NotificationPage::SIZE + 1);
        $receipts = array_slice($examined, 0, NotificationPage::SIZE);
        $last = end($receipts);
        $hasOlder = count($examined) > NotificationPage::SIZE && $last !== false;

        return new NotificationPage(
            $receipts === [] ? null : (string) $receipts[0]->sequence,
            (string) $scope->mutation_version,
            $scope->unread_count,
            $hasOlder ? NotificationCursor::at($scope->id, $last->sequence)->text() : null,
            $this->itemsOf($receipts),
        );
    }

    /**
     * The items the actor may see, in order; a receipt whose target may not even be named is left out.
     *
     * @param  list<NotificationReceipt>  $receipts
     * @return list<NotificationItem>
     */
    private function itemsOf(array $receipts): array
    {
        $items = [];

        foreach ($receipts as $receipt) {
            $occurrence = $receipt->occurrence;
            $resolver = $this->targets->resolverFor($occurrence->target_key);
            $link = $resolver->linkFor($occurrence->target_id);

            if ($link->isEmpty() && ! $resolver->disclosesMissing()) {
                continue;
            }

            $items[] = new NotificationItem(
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
            );
        }

        return $items;
    }
}
