<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Data\NotificationChangeItem;
use App\Communication\Data\NotificationChangePage;
use App\Communication\Enums\NotificationMutationType;
use App\Communication\Exceptions\NotificationCursorInvalid;
use App\Communication\Models\NotificationChange;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use App\Communication\Support\NotificationChangeCursor;
use App\Communication\Support\NotificationScopes;
use PhpOption\None;
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
    public function since(ActorIdentity $actor, string $cursor): NotificationChangePage
    {
        $scope = NotificationScope::findFor($this->scopes->keyFor($actor), $actor)
            ->getOrThrow(NotificationCursorInvalid::create());
        $read = NotificationChangeCursor::read($cursor, $scope->id);
        $upper = $read->isScanning() ? $read->upperVersion : $scope->mutation_version;

        if ($this->isOlderThanKept($scope, $read->afterVersion)) {
            return $this->reset($scope);
        }

        $examined = NotificationChange::between($scope->id, $read->afterVersion, $upper, NotificationChangePage::SIZE);
        $last = $examined === [] ? $upper : end($examined)->version;
        $isDone = $examined === [] || $last >= $upper || count($examined) < NotificationChangePage::SIZE;
        $after = $isDone ? $upper : $last;

        return new NotificationChangePage(
            false,
            (string) $scope->mutation_version,
            $scope->unread_count,
            $isDone ? null : NotificationChangeCursor::at($scope->id, $after, $upper)->text(),
            NotificationChangeCursor::at($scope->id, $after, $isDone ? $after : $upper)->text(),
            $this->itemsOf($examined),
        );
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

        return NotificationChange::oldestVersionOf($scope->id)
            ->map(fn (int $oldest) => $oldest > $afterVersion + 1)
            ->getOrElse(true);
    }

    private function reset(NotificationScope $scope): NotificationChangePage
    {
        return new NotificationChangePage(
            true,
            (string) $scope->mutation_version,
            $scope->unread_count,
            null,
            self::cursorAt($scope),
            [],
        );
    }

    /**
     * @param  list<NotificationChange>  $changes
     * @return list<NotificationChangeItem>
     */
    private function itemsOf(array $changes): array
    {
        $receipts = NotificationReceipt::withOccurrences(
            array_values(array_unique(array_map(fn (NotificationChange $change) => $change->receipt_id, $changes))),
        );

        return array_map(function (NotificationChange $change) use ($receipts): NotificationChangeItem {
            $item = isset($receipts[$change->receipt_id])
                ? $this->feed->itemOf($receipts[$change->receipt_id])
                : None::create();

            return new NotificationChangeItem(
                (string) $change->version,
                $item->isEmpty() ? NotificationMutationType::Remove : $change->mutation_type,
                $change->receipt_id,
                $item->getOrElse(Optional::create()),
            );
        }, $changes);
    }
}
