<?php

declare(strict_types=1);

namespace App\Skills\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Skills\Casts\SkillSectionsCast;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Exceptions\SkillRevisionImmutable;
use App\Skills\Support\ConditionTree;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillSection;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One numbered, immutable revision of a stored skill: its name, description, literal sections and condition in the
 * wire format, who wrote it, where a copied section came from, and the digest of the submitted input.
 *
 * @property string $id
 * @property string $skill_id
 * @property int $revision
 * @property string $name
 * @property string $description
 * @property list<SkillSection> $sections
 * @property array<string, mixed> $condition
 * @property int $condition_version
 * @property ActorType $author_type
 * @property string $author_id
 * @property string|null $source_key
 * @property string|null $source_digest
 * @property string $input_digest
 * @property CarbonImmutable $created_at
 */
#[Fillable(
    [
        'skill_id',
        'revision',
        'name',
        'description',
        'sections',
        'condition',
        'condition_version',
        'author_type',
        'author_id',
        'source_key',
        'source_digest',
        'input_digest',
    ],
)]
final class SkillRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.skill-revision';

    public const null UPDATED_AT = null;

    /**
     * The version of the condition tree format a revision is saved in.
     */
    public const int CONDITION_VERSION = 1;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'revision' => 'integer',
            'sections' => SkillSectionsCast::class,
            'condition' => 'array',
            'condition_version' => 'integer',
            'author_type' => ActorType::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => throw SkillRevisionImmutable::for($revision->id));
    }

    /**
     * Appends the draft as the skill's next revision, numbered after every earlier one; the caller holds the skill's
     * lock, so two revisions never take one number.
     */
    public static function appendTo(
        Skill $skill,
        SkillDraft $draft,
        SkillCondition $condition,
        ActorIdentity $author,
        string|null $sourceKey,
        string|null $sourceDigest,
    ): self {
        $latest = self::query()->ofSkill($skill)->max('revision');

        return self::query()->create([
            'skill_id' => $skill->id,
            'revision' => (is_numeric($latest) ? (int) $latest : 0) + 1,
            'name' => $draft->name,
            'description' => $draft->description,
            'sections' => array_map(fn (SectionDraft $section) => $section->toSection(), $draft->sections),
            'condition' => $condition->toArray(),
            'condition_version' => self::CONDITION_VERSION,
            'author_type' => $author->type,
            'author_id' => $author->id,
            'source_key' => $sourceKey,
            'source_digest' => $sourceDigest,
            'input_digest' => $draft->digest(),
        ]);
    }

    // ----------[ Queries ]----------

    public static function currentOf(Skill $skill): self
    {
        return self::query()->ofSkill($skill)->whereKey($skill->current_revision_id)->firstOrFail();
    }

    /**
     * The current revision of each of these skills, by skill id, in one query; a skill without one is left out.
     *
     * @param  list<Skill>  $skills
     * @return array<string, self>
     */
    public static function currentOfEach(array $skills): array
    {
        $ids = array_values(array_filter(array_map(fn (Skill $skill) => $skill->current_revision_id, $skills)));

        if ($ids === []) {
            return [];
        }

        return self::query()->whereKey($ids)->readLimit(count($ids))->get()->keyBy('skill_id')->all();
    }

    public static function numbered(Skill $skill, int $revision): self
    {
        return self::query()->ofSkill($skill)->where('revision', $revision)->firstOrFail();
    }

    /**
     * The skill's revisions, newest first.
     *
     * @return list<self>
     */
    public static function historyOf(Skill $skill, int $limit): array
    {
        return array_values(self::query()->ofSkill($skill)->orderByDesc('revision')->readLimit($limit)->get()->all());
    }

    // ----------[ Answers ]----------

    /**
     * The revision's condition, read through the condition tree as it stands today.
     */
    public function conditionThrough(ConditionTree $tree): SkillCondition
    {
        return $tree->hydrate($this->condition);
    }

    /**
     * The revision's content as a draft, as a restore submits it again.
     */
    public function draft(): SkillDraft
    {
        return new SkillDraft(
            $this->name,
            $this->description,
            array_map(
                fn (SkillSection $section) => new SectionDraft(
                    $section->key,
                    $section->heading,
                    $section->storedText(),
                ),
                $this->sections,
            ),
            json_encode($this->condition, JSON_THROW_ON_ERROR),
        );
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSkill(Builder $query, Skill $skill): void
    {
        $query->where('skill_id', $skill->id);
    }
}
