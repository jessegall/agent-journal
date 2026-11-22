<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\NotificationMutationType;
use App\Exceptions\NotificationUnavailable;
use App\Models\NotificationChange;
use App\Models\NotificationReceipt;
use App\Models\NotificationScope;
use Carbon\CarbonImmutable;
use Closure;
use PhpOption\Option;

/**
 * Reads, hides and reveals one receipt under its scope's lock, so the scope's unread count and version follow every
 * change of the receipt: the scope is locked first, then the receipt.
 */
final readonly class NotificationReceipts
{
    /**
     * How many receipts one Mark all batch marks in its own short transaction.
     */
    public const int MARK_ALL_BATCH = 200;

    public function __construct(private NotificationScopes $scopes) {}

    /**
     * The actor's own receipt that the finder picks from its scope; a receipt of another scope, or none, is refused
     * as unavailable either way.
     *
     * @param  Closure(string): Option<NotificationReceipt>  $find  given the actor's scope id
     *
     * @throws NotificationUnavailable
     */
    public function ownedBy(ActorIdentity $actor, Closure $find): NotificationReceipt
    {
        return NotificationScope::findFor($this->scopes->keyFor($actor), $actor)
            ->flatMap(fn (NotificationScope $scope) => $find($scope->id))
            ->getOrThrow(NotificationUnavailable::create());
    }

    /**
     * Marks the receipt read; a second mark changes nothing and keeps the first read time.
     */
    public function markRead(NotificationReceipt $receipt, CarbonImmutable $at): bool
    {
        return $this->change($receipt, fn (NotificationReceipt $locked) => $locked->markRead($at));
    }

    /**
     * Marks the next batch of the actor's unread receipts up to the watermark read, under its scope's lock in this
     * one short transaction, and answers whether the whole Mark all is done; the scope keeps where it reached, so
     * the next batch or an interrupted run goes on from there. Receipts newer than the watermark stay unread.
     *
     * @throws NotificationUnavailable
     */
    public function markAllThrough(ActorIdentity $actor, int $through, CarbonImmutable $at): bool
    {
        $scope = NotificationScope::findFor($this->scopes->keyFor($actor), $actor)
            ->map(fn (NotificationScope $found) => NotificationScope::lockedById($found->id))
            ->getOrThrow(NotificationUnavailable::create());

        $scope->beginMarkAll($through);

        $batch = NotificationReceipt::unreadThrough(
            $scope->id,
            $scope->mark_all_after,
            (int) $scope->mark_all_through,
            self::MARK_ALL_BATCH,
        );

        foreach ($batch as $receipt) {
            if ($receipt->markRead($at)) {
                $scope->removeUnread();
                NotificationChange::create($scope, $receipt, NotificationMutationType::Update);
            }
        }

        if (count($batch) < self::MARK_ALL_BATCH) {
            $scope->finishMarkAll();

            return true;
        }

        $scope->advanceMarkAll(end($batch)->sequence);

        return false;
    }

    public function hide(NotificationReceipt $receipt, CarbonImmutable $at): bool
    {
        return $this->change($receipt, fn (NotificationReceipt $locked) => $locked->hide($at));
    }

    public function reveal(NotificationReceipt $receipt): bool
    {
        return $this->change($receipt, fn (NotificationReceipt $locked) => $locked->reveal());
    }

    /**
     * @param  callable(NotificationReceipt): bool  $mutation
     */
    private function change(NotificationReceipt $receipt, callable $mutation): bool
    {
        $scope = NotificationScope::lockedById($receipt->scope_id);
        $locked = NotificationReceipt::lockedById($receipt->id);
        $wasCounted = $locked->isCounted();

        if (! $mutation($locked)) {
            return false;
        }

        match (true) {
            $wasCounted && ! $locked->isCounted() => $scope->removeUnread(),
            ! $wasCounted && $locked->isCounted() => $scope->addUnread(),
            default => $scope->recordChange(),
        };

        NotificationChange::create(
            $scope,
            $locked,
            $locked->isHidden() ? NotificationMutationType::Remove : NotificationMutationType::Update,
        );

        return true;
    }
}
