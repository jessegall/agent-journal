<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Contracts\Support\InsertsAbsentRows;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * The lookup that finds the one direct chat of two actors in an environment, whichever of them asks. It is removed
 * when the chat first gains a third member, even if that member later leaves.
 *
 * @property string $id
 * @property string $conversation_id
 * @property string $environment_key
 * @property string $low_actor
 * @property string $high_actor
 */
#[Fillable(['id', 'conversation_id', 'environment_key', 'low_actor', 'high_actor'])]
final class DirectChat extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;

    private const string LOCAL_ENVIRONMENT = '';

    // ----------[ Constructors ]----------

    /**
     * Records the chat as the direct chat of the two actors, unless the pair already has one; answers the pair's
     * lookup either way, under its row lock, so two concurrent opens keep one chat.
     */
    public static function recordFor(
        Conversation $conversation,
        string|null $environmentId,
        ActorIdentity $first,
        ActorIdentity $second,
    ): self {
        [$low, $high] = self::ordered($first, $second);

        $direct = new self([
            'id' => strtolower((string) Str::ulid()),
            'conversation_id' => $conversation->id,
            'environment_key' => $environmentId ?? self::LOCAL_ENVIRONMENT,
            'low_actor' => $low,
            'high_actor' => $high,
        ]);

        $direct->insertIfAbsent();

        return self::query()
            ->forPair($environmentId, $first, $second)
            ->lockForUpdate()
            ->firstOrFail();
    }

    // ----------[ Queries ]----------

    /**
     * Holds the pair's lock to the end of the transaction, so two opens of the same pair make one chat.
     */
    public static function lockPair(string|null $environmentId, ActorIdentity $first, ActorIdentity $second): void
    {
        [$low, $high] = self::ordered($first, $second);
        $environment = $environmentId ?? self::LOCAL_ENVIRONMENT;

        self::query()->getConnection()->select('select pg_advisory_xact_lock(hashtext(?))', [
            "direct-chat:{$environment}:{$low}:{$high}",
        ]);
    }

    /**
     * The direct chat of the two actors in the environment, once one was opened.
     */
    public static function findPair(string|null $environmentId, ActorIdentity $first, ActorIdentity $second): self|null
    {
        return self::query()->forPair($environmentId, $first, $second)->first();
    }

    // ----------[ Mutations ]----------

    /**
     * Removes the chat's direct lookup, as its first expansion past two members does; a chat without one is left.
     */
    public static function removeFor(Conversation $conversation): void
    {
        self::query()->where('conversation_id', $conversation->id)->delete();
    }

    // ----------[ Answers ]----------

    /**
     * The side of the pair that is not the given actor.
     */
    public function otherSide(ActorIdentity $actor): ActorIdentity
    {
        return self::actorOf($this->low_actor === self::key($actor) ? $this->high_actor : $this->low_actor);
    }

    public function holds(ActorIdentity $actor): bool
    {
        $key = self::key($actor);

        return $this->low_actor === $key || $this->high_actor === $key;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Conversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    // ----------[ Internals ]----------

    private static function actorOf(string $key): ActorIdentity
    {
        [$type, $id] = explode(':', $key, 2);

        return new ActorIdentity(ActorType::from($type), $id);
    }

    private static function key(ActorIdentity $actor): string
    {
        return "{$actor->type->value}:{$actor->id}";
    }

    /**
     * @return array{string, string}
     */
    private static function ordered(ActorIdentity $first, ActorIdentity $second): array
    {
        $keys = [self::key($first), self::key($second)];
        sort($keys);

        return [$keys[0], $keys[1]];
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forPair(
        Builder $query,
        string|null $environmentId,
        ActorIdentity $first,
        ActorIdentity $second,
    ): void {
        [$low, $high] = self::ordered($first, $second);

        $query->where('environment_key', $environmentId ?? self::LOCAL_ENVIRONMENT)
            ->where('low_actor', $low)
            ->where('high_actor', $high);
    }

    /**
     * The direct chats one actor is a side of.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldBy(Builder $query, ActorIdentity $actor): void
    {
        $key = self::key($actor);

        $query->where(fn (Builder $sides) => $sides->where('low_actor', $key)->orWhere('high_actor', $key));
    }
}
