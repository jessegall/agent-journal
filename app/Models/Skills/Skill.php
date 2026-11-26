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
use App\Events\Skills\SkillsChanged;
use App\Exceptions\SkillOwnerRequired;
use App\Exceptions\SkillRetired;
use App\Exceptions\SkillRevisionConflict;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Values\SkillKey;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $key
 * @property string $owner_type
 * @property string $owner_id
 * @property string|null $environment
 * @property string|null $current_revision_id
 * @property CarbonImmutable|null $retired_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $skill_key
 *
 * @mixin \Eloquent
 */
final class Skill extends JournalModel implements EventSource, Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'number' => 'integer',
            'retired_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new stored skill under its key, owned by the actor that creates it; it has no revision yet.
     */
    public static function create(SkillKey $key, ActorReference $owner, string|null $environment): self
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
    public function retireBy(ActorReference $actor): SkillRevision
    {
        $this->assertOwnedBy($actor);

        $this->retired_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $current = SkillRevision::findCurrentOf($this);
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

        $latest = SkillRevision::findCurrentOf($this)->revision;

        if ($latest !== $expectedRevision) {
            throw SkillRevisionConflict::latest($this->key, $latest);
        }
    }

    /**
     * Refuses a retire by anyone but the skill's owner.
     *
     * @throws SkillOwnerRequired
     */
    private function assertOwnedBy(ActorReference $actor): void
    {
        if ($this->owner_type !== $actor->type || $this->owner_id !== $actor->id) {
            throw SkillOwnerRequired::toRetire($this->key);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The visible skill with this id, locked until the transaction ends.
     */
    public static function findLockedVisible(string $skillId, string $environment): self
    {
        return self::query()->visibleIn($environment)->whereKey($skillId)->lockForUpdate()->firstOrFail();
    }

    public static function isKeyTaken(SkillKey $key): bool
    {
        return self::query()->withKey($key)->exists();
    }

    /**
     * Every unretired skill visible in the environment, by key.
     *
     * @return list<self>
     */
    public static function findActiveIn(string $environment, int $limit): array
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
