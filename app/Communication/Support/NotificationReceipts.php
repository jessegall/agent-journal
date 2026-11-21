<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\NotificationMutationType;
use App\Communication\Exceptions\NotificationUnavailable;
use App\Communication\Models\NotificationChange;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use Carbon\CarbonImmutable;
use Closure;
use PhpOption\Option;

/**
 * Reads, hides and reveals one receipt under its scope's lock, so the scope's unread count and version follow every
 * change of the receipt: the scope is locked first, then the receipt.
 */
final readonly class NotificationReceipts
{
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
