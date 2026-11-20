<?php

declare(strict_types=1);

namespace App\Skills\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Exceptions\SkillOwnerRequired;
use App\Skills\Exceptions\SkillRetired;
use App\Skills\Exceptions\SkillRevisionConflict;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillKey;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A skill a user stored: its fixed key, its owner, the environment it is visible in (null for the whole installation),
 * its current revision and when it was retired. Its text is in its revisions.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $key
 * @property ActorType $owner_type
 * @property string $owner_id
 * @property string|null $environment
 * @property string|null $current_revision_id
 * @property CarbonImmutable|null $retired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['key', 'owner_type', 'owner_id', 'environment', 'current_revision_id', 'retired_at'])]
final class Skill extends Model implements Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.skill';

    // ----------[ Constructors ]----------

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

    /**
     * A new stored skill under its key, owned by the actor that creates it; it has no revision yet.
     */
    public static function start(SkillKey $key, ActorIdentity $owner, string|null $environment): self
    {
        return self::query()->create(
            ['key' => $key->key, 'owner_type' => $owner->type, 'owner_id' => $owner->id, 'environment' => $environment],
        );
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
        return self::query()->where('key', $key->key)->exists();
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
                ->whereNull('retired_at')
                ->orderBy('key')
                ->readLimit($limit)
                ->get()
                ->all(),
        );
    }

    /**
     * Every stored skill of the installation, retired or not, for maintenance such as a refresh; never for an actor's
     * read.
     *
     * @return list<self>
     */
    public static function allForMaintenance(int $limit): array
    {
        return array_values(self::query()->orderBy('key')->readLimit($limit)->get()->all());
    }

    // ----------[ Mutations ]----------

    /**
     * Appends the draft as the skill's next revision, with its checked condition, and makes it current.
     */
    public function appendRevision(
        SkillDraft $draft,
        SkillCondition $condition,
        ActorIdentity $author,
        string|null $sourceKey = null,
        string|null $sourceDigest = null,
    ): SkillRevision {
        $revision = SkillRevision::appendTo($this, $draft, $condition, $author, $sourceKey, $sourceDigest);
        $this->current_revision_id = $revision->id;
        $this->save();

        return $revision;
    }

    /**
     * Takes the skill out of every future selection, when its owner asks; its revisions stay readable. Answers the
     * revision that was current.
     *
     * @throws SkillOwnerRequired
     */
    public function retireBy(ActorIdentity $actor): SkillRevision
    {
        if ($this->owner_type !== $actor->type || $this->owner_id !== $actor->id) {
            throw SkillOwnerRequired::toRetire($this->key);
        }

        $this->retired_at = CarbonImmutable::now();
        $this->save();

        return SkillRevision::currentOf($this);
    }

    // ----------[ Answers ]----------

    /**
     * Appends an earlier revision's content as the next revision, with its condition checked again today.
     */
    public function restoreFrom(SkillRevision $earlier, SkillCondition $condition, ActorIdentity $author): SkillRevision
    {
        return $this->appendRevision(
            $earlier->draft(),
            $condition,
            $author,
            $earlier->source_key,
            $earlier->source_digest,
        );
    }

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

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
    }

    public function skillKey(): SkillKey
    {
        return SkillKey::from($this->key);
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
}
