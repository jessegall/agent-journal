<?php

declare(strict_types=1);

namespace App\Models\Inboxes;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Events\EventSource;
use App\Contracts\Inboxes\LabeledInbox;
use App\Contracts\Records\ReadableModel;
use App\Events\Inboxes\InboxMessageNumberTaken;
use App\Events\Inboxes\InboxOpened;
use App\Exceptions\InboxUnavailable;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PhpOption\Option;

/**
 * A place messages are sent into and work is held at: its provider owns it, its members take part in it, and an
 * inbox that forwards its members receives what is addressed to them. Core's own inboxes are named ones such as main,
 * and each actor's personal inbox.
 *
 * @property string $id
 * @property string $provider_key
 * @property string $provider_id
 * @property string|null $name
 * @property string $label
 * @property bool $forwards_members
 * @property int $last_message_number
 */
#[Table('inboxes')]
#[Fillable([
    'provider_key',
    'provider_id',
    'name',
    'label',
    'forwards_members',
])]
final class Inbox extends Model implements Assignee, EventSource, LabeledInbox, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string ASSIGNEE_TYPE = 'inbox';

    /**
     * The provider of core's named inboxes.
     */
    public const string NAMED_PROVIDER = 'core.inbox';

    /**
     * The provider of each actor's personal inbox, whose provider id is the actor.
     */
    public const string PERSONAL_PROVIDER = 'core.personal';

    public const string MAIN = 'main';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'forwards_members' => 'boolean',
            'last_message_number' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(
        string $providerKey,
        string $providerId,
        string $label,
        string|null $name = null,
        bool $forwardsMembers = false,
    ): self {
        $inbox = self::query()->create([
            'provider_key' => $providerKey,
            'provider_id' => $providerId,
            'name' => $name,
            'label' => $label,
            'forwards_members' => $forwardsMembers,
        ]);

        $inbox->raise(new InboxOpened($inbox->id));

        return $inbox;
    }

    // ----------[ Mutations ]----------

    /**
     * Takes the number of the inbox's next message on this locked row: the first message of an inbox is 1.
     */
    public function takeMessageNumber(): int
    {
        $this->last_message_number++;
        $this->assertSaved($this->save());
        $this->raise(new InboxMessageNumberTaken($this->id));

        return $this->last_message_number;
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an actor with no personal inbox yet.
     *
     * @phpstan-assert self $row
     *
     * @throws InboxUnavailable
     */
    private static function assertPersonalFound(self|null $row, ActorIdentity $actor): void
    {
        if ($row === null) {
            throw InboxUnavailable::forActor($actor->id);
        }
    }

    /**
     * Refuses an inbox that is not there.
     *
     * @phpstan-assert self $row
     *
     * @throws InboxUnavailable
     */
    private static function assertFound(self|null $row, string $id): void
    {
        if ($row === null) {
            throw InboxUnavailable::forId($id);
        }
    }

    // ----------[ Queries ]----------

    /**
     * @return Option<self>
     */
    public static function named(string $name): Option
    {
        return Option::fromValue(self::query()->withName($name)->first());
    }

    /**
     * @throws InboxUnavailable
     */
    public static function main(): self
    {
        return self::named(self::MAIN)->getOrThrow(InboxUnavailable::forName(self::MAIN));
    }

    /**
     * The actor's personal inbox, which every admitted actor has.
     *
     * @throws InboxUnavailable
     */
    public static function personalOf(ActorIdentity $actor): self
    {
        $row = self::query()->personalTo($actor)->first();
        self::assertPersonalFound($row, $actor);

        return $row;
    }

    /**
     * The inbox row locked for update until the transaction ends; a missing inbox is refused by its id.
     *
     * @throws InboxUnavailable
     */
    public static function lockedById(string $id): self
    {
        $row = self::query()->whereKey($id)->lockForUpdate()->first();
        self::assertFound($row, $id);

        return $row;
    }

    public function inboxId(): string
    {
        return $this->id;
    }

    public function inboxLabel(): string
    {
        return $this->label;
    }

    public function assigneeIdentity(): AssigneeIdentity
    {
        return new AssigneeIdentity(self::ASSIGNEE_TYPE, $this->id);
    }

    /**
     * @return HasMany<InboxMember, $this>
     */
    public function members(): HasMany
    {
        return $this->hasMany(InboxMember::class);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forwarding(Builder $query): void
    {
        $query->where('forwards_members', true);
    }

    /**
     * Core's own inboxes, named and personal, which hold work as assignees.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ownedByCore(Builder $query): void
    {
        $query->whereIn('provider_key', [
            self::NAMED_PROVIDER,
            self::PERSONAL_PROVIDER,
        ]);
    }

    /**
     * The inboxes the actor is attached to now.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function attachedTo(Builder $query, ActorIdentity $actor): void
    {
        $query->whereIn('id', InboxMember::query()->active()->ofActor($actor)->select('inbox_id'));
    }

    /**
     * The inbox of that name.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withName(Builder $query, string $name): void
    {
        $query->where('name', $name);
    }

    /**
     * The actor's personal inbox.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function personalTo(Builder $query, ActorIdentity $actor): void
    {
        $query->where('provider_key', self::PERSONAL_PROVIDER)->where('provider_id', $actor->text());
    }
}
