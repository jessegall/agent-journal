<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Models\Notifications\NotificationChange;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Notifications\Data\NotificationChangeItem;
use App\Notifications\Data\NotificationChangePage;
use App\Notifications\Enums\NotificationMutationType;
use App\Notifications\Exceptions\NotificationCursorInvalid;
use App\Notifications\NotificationChangeCursor;
use App\Notifications\NotificationScopes;
use App\Support\ActorReference;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * Reads the actor's changes after a cursor in pages of twenty, through one upper version pinned when the scan began,
 * each receipt reauthorized against its current state: a receipt hidden or out of sight now reads as a removal. The
 * cursor moves over every examined version; one older than the kept changes answers reset.
 */
final readonly class NotificationChanges
{
    public function __construct(
        private NotificationScopes $scopes,
        private NotificationFeed $feed,
    ) {}

    /**
     * @throws NotificationCursorInvalid
     */
    public function since(ActorReference $actor, string $cursor): NotificationChangePage
    {
        $scope = NotificationScope::findFor($this->scopes->keyFor($actor), $actor)
            ->getOrThrow(NotificationCursorInvalid::create());

        $read = NotificationChangeCursor::read($cursor, $scope->id);
        $upper = $read->isScanning() ? $read->upperVersion : $scope->mutation_version;

        if ($this->isOlderThanKept($scope, $read->afterVersion)) {
            return $this->reset($scope);
        }

        $examined = NotificationChange::findBetween(
            $scope->id,
            $read->afterVersion,
            $upper,
            NotificationChangePage::SIZE,
        );

        $last = $examined === [] ? $upper : end($examined)->version;
        $isDone = $examined === [] || $last >= $upper || count($examined) < NotificationChangePage::SIZE;
        $after = $isDone ? $upper : $last;

        return NotificationChangePage::from([
            'isReset' => false,
            'version' => (string) $scope->mutation_version,
            'unread' => $scope->unread_count,
            'nextCursor' => $isDone ? null : NotificationChangeCursor::at($scope->id, $after, $upper)->text(),
            'cursor' => NotificationChangeCursor::at($scope->id, $after, $isDone ? $after : $upper)->text(),
            'changes' => $this->itemsOf($examined),
        ]);
    }

    /**
     * The cursor that starts catching up from this version of the scope.
     */
    public static function cursorAt(NotificationScope $scope): string
    {
        return NotificationChangeCursor::at($scope->id, $scope->mutation_version, $scope->mutation_version)->text();
    }

    private function isOlderThanKept(NotificationScope $scope, int $afterVersion): bool
    {
        if ($afterVersion >= $scope->mutation_version) {
            return false;
        }

        return NotificationChange::resolveOldestVersionOf($scope->id)
            ->map(fn (int $oldest) => $oldest > $afterVersion + 1)
            ->getOrElse(true);
    }

    private function reset(NotificationScope $scope): NotificationChangePage
    {
        return NotificationChangePage::from([
            'isReset' => true,
            'version' => (string) $scope->mutation_version,
            'unread' => $scope->unread_count,
            'nextCursor' => null,
            'cursor' => self::cursorAt($scope),
            'changes' => [],
        ]);
    }

    /**
     * @param  list<NotificationChange>  $changes
     * @return list<NotificationChangeItem>
     */
    private function itemsOf(array $changes): array
    {
        $receipts = NotificationReceipt::findWithOccurrences(
            array_values(array_unique(array_map(fn (NotificationChange $change) => $change->receipt_id, $changes))),
        );

        $items = $this->feed->itemsOf(array_values($receipts));

        return array_map(function (NotificationChange $change) use ($items): NotificationChangeItem {
            $item = Option::fromArraysValue($items, $change->receipt_id);

            return NotificationChangeItem::from([
                'version' => (string) $change->version,
                'type' => $item->isEmpty() ? NotificationMutationType::Remove : $change->mutation_type,
                'receiptId' => $change->receipt_id,
                'item' => $item->getOrElse(Optional::create()),
            ]);
        }, $changes);
    }
}
