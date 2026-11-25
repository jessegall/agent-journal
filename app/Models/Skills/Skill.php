<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Enums\Assignments\ActorType;
use App\Events\Skills\SkillsChanged;
use App\Exceptions\SkillOwnerRequired;
use App\Exceptions\SkillRetired;
use App\Exceptions\SkillRevisionConflict;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use App\Values\SkillKey;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $key
 * @property ActorType $owner_type
 * @property string $owner_id
 * @property ?string $environment
 * @property ?string $current_revision_id
 * @property ?CarbonImmutable $retired_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $skill_key attribute
 */
final class Skill extends Model implements EventSource, Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'owner_type' => ActorType::class,
            'number' => 'integer',
            'retired_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new stored skill under its key, owned by the actor that creates it; it has no revision yet.
     */
    public static function create(SkillKey $key, ActorIdentity $owner, string|null $environment): self
    {
        $skill = new self();
        $skill->key = $key->key;
        $skill->owner_type = $owner->type;
        $skill->owner_id = $owner->id;
        $skill->environment = $environment;
        $skill->assertSaved($skill->save());

        return $skill;
    }

    // ----------[ Mutations ]----------

    /**
     * Makes the revision just written the skill's current one, and announces the change.
     */
    public function makeCurrent(SkillRevision $revision): void
    {
        $this->current_revision_id = $revision->id;
        $this->assertSaved($this->save());
        $this->raise(new SkillsChanged($this->id, $revision->revision));
    }

    /**
     * Takes the skill out of every future selection, when its owner asks; its revisions stay readable. Answers the
     * revision that was current.
     *
     * @throws SkillOwnerRequired
     */
    public function retireBy(ActorIdentity $actor): SkillRevision
    {
        $this->assertOwnedBy($actor);

        $this->retired_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $current = SkillRevision::currentOf($this);
        $this->raise(new SkillsChanged($this->id, $current->revision));

        return $current;
    }

    // ----------[ Predicates ]----------

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<SkillKey, never>
     */
    protected function skillKey(): Attribute
    {
        return Accessor::get(fn () => SkillKey::from($this->key));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a write to a retired skill, or one made against a revision that is no longer current.
     *
     * @throws SkillRetired
     * @throws SkillRevisionConflict
     */
    public function assertWritableAt(int $expectedRevision): void
    {
        if ($this->isRetired()) {
            throw SkillRetired::for($this->key);
        }

        $latest = SkillRevision::currentOf($this)->revision;

        if ($latest !== $expectedRevision) {
            throw SkillRevisionConflict::latest($this->key, $latest);
        }
    }

    /**
     * Refuses a retire by anyone but the skill's owner.
     *
     * @throws SkillOwnerRequired
     */
    private function assertOwnedBy(ActorIdentity $actor): void
    {
        if ($this->owner_type !== $actor->type || $this->owner_id !== $actor->id) {
            throw SkillOwnerRequired::toRetire($this->key);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The visible skill with this id, locked until the transaction ends.
     */
    public static function lockVisible(string $skillId, string $environment): self
    {
        return self::query()->visibleIn($environment)->whereKey($skillId)->lockForUpdate()->firstOrFail();
    }

    public static function keyTaken(SkillKey $key): bool
    {
        return self::query()->withKey($key)->exists();
    }

    /**
     * Every unretired skill visible in the environment, by key.
     *
     * @return list<self>
     */
    public static function activeIn(string $environment, int $limit): array
    {
        return array_values(
            self::query()->visibleIn($environment)
                ->unretired()
                ->inKeyOrder()
                ->readExactly($limit)
                ->get()
                ->all(),
        );
    }

    // ----------[ Scopes ]----------

    /**
     * Skills visible in this environment: those of the whole installation and those of the environment itself.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function visibleIn(Builder $query, string $environment): void
    {
        $query->where(
            fn (Builder $visible) => $visible->whereNull('environment')->orWhere('environment', $environment),
        );
    }

    /**
     * The skill of that key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withKey(Builder $query, SkillKey $key): void
    {
        $query->where('key', $key->key);
    }

    /**
     * The skills not retired.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unretired(Builder $query): void
    {
        $query->whereNull('retired_at');
    }

    /**
     * The skills in the order of their key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inKeyOrder(Builder $query): void
    {
        $query->orderBy('key');
    }
}
