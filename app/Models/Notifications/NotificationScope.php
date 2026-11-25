<?php

declare(strict_types=1);

namespace App\Models\Notifications;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Messages\NotificationsChanged;
use App\Events\Messages\NotificationsMarkAllAdvanced;
use App\Events\Messages\NotificationsMarkAllFinished;
use App\Events\Messages\NotificationsMarkAllStarted;
use App\Models\Access\User;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $scope_key
 * @property string $recipient_type
 * @property string $recipient_id
 * @property int $next_sequence
 * @property int $mutation_version
 * @property int $unread_count
 * @property CarbonImmutable|null $fenced_at
 * @property int|null $mark_all_through
 * @property int $mark_all_after
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('notification_scopes')]
final class NotificationScope extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'next_sequence' => 'integer',
            'mutation_version' => 'integer',
            'unread_count' => 'integer',
            'mark_all_through' => 'integer',
            'mark_all_after' => 'integer',
            'fenced_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The recipient's empty scope, inserted unless it already has one; read it with lockedFor afterwards.
     */
    public static function create(string $key, ActorReference $recipient): self
    {
        $scope = new self();
        $scope->scope_key = $key;
        $scope->recipient_type = $recipient->type;
        $scope->recipient_id = $recipient->id;
        $scope->next_sequence = 1;
        $scope->mutation_version = 0;
        $scope->unread_count = 0;

        $scope->id = $scope->newUniqueId();
        $scope->insertIfAbsent();

        return $scope;
    }

    // ----------[ Mutations ]----------

    /**
     * A new unread receipt took the next sequence.
     */
    public function addReceipt(): void
    {
        $this->next_sequence++;
        $this->unread_count++;
        $this->mutation_version++;
        $this->assertSaved($this->save());
        $this->raise(new NotificationsChanged($this->id));
    }

    /**
     * A receipt became unread and visible again.
     */
    public function addUnread(): void
    {
        $this->unread_count++;
        $this->mutation_version++;
        $this->assertSaved($this->save());
        $this->raise(new NotificationsChanged($this->id));
    }

    /**
     * An unread visible receipt was read or hidden.
     */
    public function removeUnread(): void
    {
        $this->unread_count--;
        $this->mutation_version++;
        $this->assertSaved($this->save());
        $this->raise(new NotificationsChanged($this->id));
    }

    /**
     * A Mark all up to the watermark starts, or resumes from where an interrupted one reached; a higher watermark
     * widens it, and a lower one never narrows it.
     */
    public function beginMarkAll(int $through): void
    {
        if ($this->mark_all_through !== null && $this->mark_all_through >= $through) {
            return;
        }

        $this->mark_all_through = $through;
        $this->assertSaved($this->save());
        $this->raise(new NotificationsMarkAllStarted($this->id, $through));
    }

    /**
     * The Mark all under way reached this sequence; an interrupted run resumes after it.
     */
    public function advanceMarkAll(int $sequence): void
    {
        $this->mark_all_after = $sequence;
        $this->assertSaved($this->save());
        $this->raise(new NotificationsMarkAllAdvanced($this->id, $sequence));
    }

    public function finishMarkAll(): void
    {
        $this->mark_all_through = null;
        $this->mark_all_after = 0;
        $this->assertSaved($this->save());
        $this->raise(new NotificationsMarkAllFinished($this->id));
    }

    /**
     * A receipt changed without changing the unread count.
     */
    public function recordChange(): void
    {
        $this->mutation_version++;
        $this->assertSaved($this->save());
        $this->raise(new NotificationsChanged($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The recipient's scope, when it has ever received a notification.
     *
     * @return Option<self>
     */
    public static function findFor(string $key, ActorReference $recipient): Option
    {
        $notificationScope = self::query()->ofRecipient($key, $recipient)->first();

        return Option::fromValue($notificationScope);
    }

    /**
     * The user a scope belongs to, when its recipient is a user; an agent's scope has no browser to tell.
     *
     * @return Option<string>
     */
    public static function resolveUserOf(string $id): Option
    {
        $scope = self::query()->whereKey($id)->ofUsers()->first();

        return Option::fromValue($scope?->recipient_id);
    }

    /**
     * The recipient's scope under its row lock, for a change of its receipts or its count.
     */
    public static function findLockedFor(string $key, ActorReference $recipient): self
    {
        return self::query()->ofRecipient($key, $recipient)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRecipient(Builder $query, string $key, ActorReference $recipient): void
    {
        $query->where('scope_key', $key)
            ->where('recipient_type', $recipient->type)
            ->where('recipient_id', $recipient->id);
    }

    /**
     * The scopes whose recipient is a user.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofUsers(Builder $query): void
    {
        $query->where('recipient_type', User::storedType());
    }
}
