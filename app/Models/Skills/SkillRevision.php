<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Casts\SkillSectionsCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Skills\SkillCondition;
use App\Enums\ActorType;
use App\Exceptions\SkillRevisionImmutable;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use App\Support\ConditionTree;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillSection;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $skill_id
 * @property int $revision
 * @property string $name
 * @property string $description
 * @property array $sections
 * @property array $condition
 * @property int $condition_version
 * @property ActorType $author_type
 * @property string $author_id
 * @property ?string $source_key
 * @property ?string $source_digest
 * @property string $input_digest
 * @property Carbon $created_at
 * @property mixed $draft attribute
 */
final class SkillRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
            'sections' => SkillSectionsCast::class,
            'condition' => 'array',
            'condition_version' => 'integer',
            'author_type' => ActorType::class,
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
        ActorIdentity $author,
        string|null $sourceKey,
        string|null $sourceDigest,
    ): self {
        $latest = self::query()->ofSkill($skill)->max('revision');

        $skillRevision = new self();
        $skillRevision->skill_id = $skill->id;
        $skillRevision->revision = (is_numeric($latest) ? (int) $latest : 0) + 1;
        $skillRevision->name = $draft->name;
        $skillRevision->description = $draft->description;
        $skillRevision->sections = array_map(fn (SectionDraft $section) => $section->toSection(), $draft->sections);
        $skillRevision->condition = $condition->toArray();
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
        return $tree->hydrate($this->condition);
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
                $this->sections,
            ),
            json_encode($this->condition, JSON_THROW_ON_ERROR),
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

        return self::query()->whereKey($ids)->readExactly(count($ids))->get()->keyBy('skill_id')->all();
    }

    public static function numbered(Skill $skill, int $revision): self
    {
        return self::query()->ofSkill($skill)->atRevision($revision)->firstOrFail();
    }

    /**
     * The skill's revisions, newest first.
     *
     * @return list<self>
     */
    public static function historyOf(Skill $skill, int $limit): array
    {
        return array_values(self::query()->ofSkill($skill)->newestRevisionFirst()->readExactly($limit)->get()->all());
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
