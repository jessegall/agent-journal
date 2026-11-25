<?php

declare(strict_types=1);

namespace App\Models\Inboxes;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
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
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $provider_key
 * @property string $provider_id
 * @property ?string $name
 * @property string $label
 * @property bool $forwards_members
 * @property int $last_message_number
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property Collection<int, InboxMember>|InboxMember[] $members
 */
#[Table('inboxes')]
final class Inbox extends Model implements Assignee, EventSource, LabeledInbox, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
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
        $inbox = new self();
        $inbox->provider_key = $providerKey;
        $inbox->provider_id = $providerId;
        $inbox->name = $name;
        $inbox->label = $label;
        $inbox->forwards_members = $forwardsMembers;
        $inbox->assertSaved($inbox->save());

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

    // ----------[ Queries ]----------

    /**
     * @return Option<self>
     */
    public static function named(string $name): Option
    {
        $inbox = self::query()->withName($name)->first();

        return Option::fromValue($inbox);
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
        return self::query()->personalTo($actor)->firstOr(InboxUnavailable::throwing()->forActor($actor->id));
    }

    /**
     * The inbox row locked for update until the transaction ends; a missing inbox is refused by its id.
     *
     * @throws InboxUnavailable
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(InboxUnavailable::throwing()->forId($id));
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
        $query->whereIn('id', InboxMember::query()->active()->ofActor($actor)->inboxIds());
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

    /**
     * The rows of the given provider.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProvider(Builder $query, string $providerId): void
    {
        $query->where('provider_id', $providerId);
    }

    /**
     * The rows of the given provider key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withProviderKey(Builder $query, string $providerKey): void
    {
        $query->where('provider_key', $providerKey);
    }

    /**
     * The rows of any of the given provider keys.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $providerKeys
     */
    #[Scope]
    protected function withAnyProviderKey(Builder $query, array|Builder|Closure $providerKeys): void
    {
        $query->whereIn('provider_key', $providerKeys);
    }
}
