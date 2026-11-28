<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Skills\ConditionTree;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Data\Conditions\StoredConditionData;
use App\Skills\Exceptions\SkillRevisionImmutable;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Support\ActorReference;
use App\Values\SkillSection;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $skill_id
 * @property int $revision
 * @property string $name
 * @property string $description
 * @property DataCollection<int, SkillSection> $sections
 * @property StoredConditionData $condition
 * @property int $condition_version
 * @property string $author_type
 * @property string $author_id
 * @property string|null $source_key
 * @property string|null $source_digest
 * @property string $input_digest
 * @property CarbonImmutable $created_at
 * @property-read mixed $draft
 *
 * @mixin \Eloquent
 */
final class SkillRevision extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    public const null UPDATED_AT = null;

    /**
     * The version of the condition tree format a revision is saved in.
     */
    public const int CONDITION_VERSION = 1;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'revision' => 'integer',
            'sections' => DataCollection::class.':'.SkillSection::class,
            'condition' => StoredConditionData::class,
            'condition_version' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => $revision->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * Appends the draft as the skill's next revision, numbered after every earlier one; the caller holds the skill's
     * lock, so two revisions never take one number.
     */
    public static function create(
        Skill $skill,
        SkillDraft $draft,
        SkillCondition $condition,
        ActorReference $author,
        string|null $sourceKey,
        string|null $sourceDigest,
    ): self {
        $skillRevision = new self();
        $skillRevision->skill_id = $skill->id;
        $skillRevision->revision = self::resolveNextRevision($skill);
        $skillRevision->name = $draft->name;
        $skillRevision->description = $draft->description;
        $sections = array_map(fn (SectionDraft $section) => $section->toSection(), $draft->sections);
        $skillRevision->sections = SkillSection::collect($sections, DataCollection::class);
        $skillRevision->condition = StoredConditionData::from($condition->toArray());
        $skillRevision->condition_version = self::CONDITION_VERSION;
        $skillRevision->author_type = $author->type;
        $skillRevision->author_id = $author->id;
        $skillRevision->source_key = $sourceKey;
        $skillRevision->source_digest = $sourceDigest;
        $skillRevision->input_digest = $draft->digest();
        $skillRevision->save();

        return $skillRevision;
    }

    // ----------[ Transformers ]----------

    /**
     * The revision's condition, read through the condition tree as it stands today.
     */
    public function conditionThrough(ConditionTree $tree): SkillCondition
    {
        return $tree->hydrate($this->condition->toArray());
    }

    // ----------[ Accessors ]----------

    /**
     * The revision's content as a draft, as a restore submits it again.
     *
     * @return Attribute<SkillDraft, never>
     */
    protected function draft(): Attribute
    {
        return Accessor::get(fn () => new SkillDraft(
            $this->name,
            $this->description,
            array_map(
                fn (SkillSection $section) => new SectionDraft(
                    $section->key,
                    $section->heading,
                    $section->storedText(),
                ),
                $this->sections->items(),
            ),
            $this->condition->toJson(),
        ));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a revision stays as it was written.
     *
     * @throws SkillRevisionImmutable
     */
    private function assertUnedited(): never
    {
        throw SkillRevisionImmutable::for($this->id);
    }

    // ----------[ Queries ]----------

    public static function findCurrentOf(Skill $skill): self
    {
        return self::query()->ofSkill($skill)->whereKey($skill->current_revision_id)->firstOrFail();
    }

    /**
     * The current revision of each of these skills, by skill id, in one query; a skill without one is left out.
     *
     * @param  list<Skill>  $skills
     * @return array<string, self>
     */
    public static function findCurrentOfEach(array $skills): array
    {
        $ids = array_values(array_filter(array_map(fn (Skill $skill) => $skill->current_revision_id, $skills)));

        if ($ids === []) {
            return [];
        }

        return self::query()->whereKey($ids)->get()->keyBy('skill_id')->all();
    }

    public static function findNumbered(Skill $skill, int $revision): self
    {
        return self::query()->ofSkill($skill)->atRevision($revision)->firstOrFail();
    }

    /**
     * The skill's revisions, newest first.
     *
     * @return list<self>
     */
    public static function findHistoryOf(Skill $skill, int $limit): array
    {
        return array_values(self::query()->ofSkill($skill)->newestRevisionFirst()->limit($limit)->get()->all());
    }

    /**
     * The revision the skill's next draft takes: one past its newest.
     */
    public static function resolveNextRevision(Skill $skill): int
    {
        return (int) self::query()->ofSkill($skill)->max('revision') + 1;
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

    /**
     * The revision of that number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function atRevision(Builder $query, int $revision): void
    {
        $query->where('revision', $revision);
    }

    /**
     * The revisions newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestRevisionFirst(Builder $query): void
    {
        $query->orderByDesc('revision');
    }
}
