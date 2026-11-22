<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Communication\Support\ChatInboxes;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Chat\Enums\ConversationState;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * One chat's metadata: the chat inbox it owns, the opaque provider id that inbox is registered under, its title, its
 * owner and whether it is still open. Its members are the inbox's active intervals; what is docked in it hangs here.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $provider_id
 * @property string|null $title
 * @property string|null $owner_type
 * @property string|null $owner_id
 * @property string|null $environment_id
 * @property ConversationState $state
 * @property CarbonImmutable|null $closed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read ActorIdentity|null $owner
 */
#[Fillable(['inbox_id', 'provider_id', 'title', 'owner_type', 'owner_id', 'environment_id', 'state'])]
final class Conversation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string CHAT_INBOX_PROVIDER = ChatInboxes::PROVIDER_KEY;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'state' => ConversationState::class,
            'closed_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * The open chat over the inbox registered under the provider id, owned by the actor that opened it.
     */
    public static function openFor(
        string $inboxId,
        string $providerId,
        ActorIdentity $owner,
        string|null $environmentId,
        string|null $title,
    ): self {
        $conversation = new self([
            'inbox_id' => $inboxId,
            'provider_id' => $providerId,
            'title' => $title,
            ...$owner->asColumns('owner'),
            'environment_id' => $environmentId,
            'state' => ConversationState::Open,
        ]);

        $conversation->save();

        return $conversation;
    }

    // ----------[ Queries ]----------

    /**
     * @throws ConversationUnavailable
     */
    public static function forInbox(string $inboxId): self
    {
        return self::query()
            ->where('inbox_id', $inboxId)
            ->firstOr(fn () => throw ConversationUnavailable::missing($inboxId));
    }

    /**
     * The chat over the inbox under its row lock, for a change that must happen once.
     *
     * @throws ConversationUnavailable
     */
    public static function lockedForInbox(string $inboxId): self
    {
        return self::query()
            ->where('inbox_id', $inboxId)
            ->lockForUpdate()
            ->firstOr(fn () => throw ConversationUnavailable::missing($inboxId));
    }

    /**
     * The chat under its row lock, for a dock change that must happen once.
     *
     * @throws ConversationUnavailable
     */
    public static function lockedById(string $id): self
    {
        return self::query()
            ->whereKey($id)
            ->lockForUpdate()
            ->firstOr(fn () => throw ConversationUnavailable::missing($id));
    }

    // ----------[ Mutations ]----------

    /**
     * Closes the chat for good: it has no owner from now on and takes no more messages.
     *
     * @throws ConversationUnavailable
     */
    public function close(CarbonImmutable $at): void
    {
        $this->assertOpen();
        $this->state = ConversationState::Closed;
        $this->closed_at = $at;
        $this->owner_type = null;
        $this->owner_id = null;
        $this->save();
    }

    /**
     * @throws ConversationUnavailable
     */
    public function transferTo(ActorIdentity $owner): void
    {
        $this->assertOpen();
        $this->owner_type = $owner->type->value;
        $this->owner_id = $owner->id;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isOpen(): bool
    {
        return $this->state->isOpen();
    }

    public function isOwnedBy(ActorIdentity $actor): bool
    {
        return $this->owner_type === $actor->type->value && $this->owner_id === $actor->id;
    }

    /**
     * The actor that owns the open chat; a closed chat has none.
     *
     * @return Attribute<ActorIdentity|null, never>
     */
    protected function owner(): Attribute
    {
        return Attribute::get(fn () => $this->owner_type === null || $this->owner_id === null
            ? null
            : new ActorIdentity(ActorType::from($this->owner_type), $this->owner_id));
    }

    /**
     * Whether the actor takes part in the chat: its owner, or one side of its direct pair.
     */
    public function joins(ActorIdentity $actor): bool
    {
        return $this->isOwnedBy($actor) || $this->directChat?->holds($actor) === true;
    }

    // ----------[ Relations ]----------

    /**
     * @return HasOne<DirectChat, $this>
     */
    public function directChat(): HasOne
    {
        return $this->hasOne(DirectChat::class);
    }

    /**
     * @return HasMany<DockPlacement, $this>
     */
    public function placements(): HasMany
    {
        return $this->hasMany(DockPlacement::class);
    }

    // ----------[ Internals ]----------

    /**
     * @throws ConversationUnavailable
     */
    private function assertOpen(): void
    {
        if (! $this->isOpen()) {
            throw ConversationUnavailable::closed($this->id);
        }
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, ActorIdentity $actor): void
    {
        $query->where('owner_type', $actor->type->value)->where('owner_id', $actor->id);
    }

    /**
     * The chats the actor takes part in.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function joinedBy(Builder $query, ActorIdentity $actor): void
    {
        $query->where(fn (Builder $member) => $member
            ->ownedBy($actor)
            ->orWhereHas('directChat', fn (Builder $direct) => $direct->heldBy($actor)));
    }
}
