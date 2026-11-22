<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Communication\Events\NotificationsChanged;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * One recipient's notifications in one scope: the sequence its next receipt gets, the version every change raises
 * and the exact count of its unread visible receipts. Every change of its receipts happens under this row's lock.
 *
 * @property string $id
 * @property string $scope_key
 * @property string $recipient_type
 * @property string $recipient_id
 * @property int $next_sequence
 * @property int $mutation_version
 * @property int $unread_count
 * @property CarbonImmutable|null $fenced_at
 * @property int|null $mark_all_through the watermark of a Mark all still under way
 * @property int $mark_all_after the last sequence a Mark all under way has reached
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Table('notification_scopes')]
#[Fillable(['scope_key', 'recipient_type', 'recipient_id', 'next_sequence', 'mutation_version', 'unread_count'])]
final class NotificationScope extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

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
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * The recipient's empty scope, inserted unless it already has one; read it with lockedFor afterwards.
     */
    public static function create(string $key, ActorIdentity $recipient): self
    {
        $scope = new self([
            'scope_key' => $key,
            ...$recipient->asColumns('recipient'),
            'next_sequence' => 1,
            'mutation_version' => 0,
            'unread_count' => 0,
        ]);

        $scope->id = $scope->newUniqueId();
        $scope->insertIfAbsent();

        return $scope;
    }

    // ----------[ Queries ]----------

    /**
     * The recipient's scope, when it has ever received a notification.
     *
     * @return Option<self>
     */
    public static function findFor(string $key, ActorIdentity $recipient): Option
    {
        return Option::fromValue(self::query()->ofRecipient($key, $recipient)->first());
    }

    /**
     * The user a scope belongs to, when its recipient is a user; an agent's scope has no browser to tell.
     *
     * @return Option<string>
     */
    public static function userOf(string $id): Option
    {
        $scope = self::query()->whereKey($id)->where('recipient_type', ActorType::User->value)->first();

        return Option::fromValue($scope?->recipient_id);
    }

    /**
     * The recipient's scope under its row lock, for a change of its receipts or its count.
     */
    public static function lockedFor(string $key, ActorIdentity $recipient): self
    {
        return self::query()->ofRecipient($key, $recipient)->lockForUpdate()->firstOrFail();
    }

    /**
     * The scope under its row lock, by id.
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
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
    }

    /**
     * The Mark all under way reached this sequence; an interrupted run resumes after it.
     */
    public function advanceMarkAll(int $sequence): void
    {
        $this->mark_all_after = $sequence;
        $this->assertSaved($this->save());
    }

    public function finishMarkAll(): void
    {
        $this->mark_all_through = null;
        $this->mark_all_after = 0;
        $this->assertSaved($this->save());
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

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRecipient(Builder $query, string $key, ActorIdentity $recipient): void
    {
        $query->where('scope_key', $key)
            ->where('recipient_type', $recipient->type->value)
            ->where('recipient_id', $recipient->id);
    }
}
