<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\PurposeType;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * @property string $id
 * @property string $project_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $profile_key
 * @property PurposeType $purpose_type
 * @property string|null $subject_type
 * @property string|null $subject_id
 * @property string $label
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $subject_record
 *
 * @mixin \Eloquent
 */
#[Table('helper_purposes')]
final class HelperPurpose extends JournalModel implements ProjectOwned, ReadableModel
{
    use BelongsToOneActor;
    use BelongsToProject;
    use BoundedReads;
    use InsertsAbsentRows;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['purpose_type' => PurposeType::class];
    }

    // ----------[ Constructors ]----------

    /**
     * The one purpose of the parent and profile for the record in the project, made by the first of any concurrent
     * starts; a later start reads the one that won. Its label is the record's alias and id, never a fetched title.
     */
    public static function create(
        string $projectId,
        ActorReference $parent,
        string $profileKey,
        RecordIdentity $subject,
    ): self {
        $purpose = new self();
        $purpose->project_id = $projectId;
        $purpose->profile_key = $profileKey;
        $purpose->purpose_type = PurposeType::Subject;
        $purpose->subject_type = $subject->type;
        $purpose->subject_id = $subject->id;
        $purpose->label = "{$subject->type}:{$subject->id}";

        $purpose->id = strtolower((string) Str::ulid());
        $purpose->belongTo($parent);
        $purpose->insertIfAbsent();

        return self::findOfSubject($projectId, $parent, $profileKey, $subject);
    }

    // ----------[ Accessors ]----------

    /**
     * The record the purpose is about, such as a plan to review; none for a free purpose.
     *
     * @return Attribute<Option<RecordIdentity>, never>
     */
    protected function subjectRecord(): Attribute
    {
        return Accessor::get(fn () => $this->subjectRecordOf($this->subject_type, $this->subject_id));
    }

    // ----------[ Internals ]----------

    /**
     * @return Option<RecordIdentity>
     */
    private function subjectRecordOf(string|null $type, string|null $id): Option
    {
        if ($type === null || $id === null) {
            return None::create();
        }

        return new Some(new RecordIdentity($type, $id));
    }

    private static function start(
        string $projectId,
        ActorReference $parent,
        string $profileKey,
        PurposeType $type,
        RecordIdentity|null $subject,
        string $label,
    ): self {
        $purpose = new self();
        $purpose->project_id = $projectId;
        $purpose->profile_key = $profileKey;
        $purpose->purpose_type = $type;
        $purpose->subject_type = $subject?->type;
        $purpose->subject_id = $subject?->id;
        $purpose->label = $label;
        $purpose->belongTo($parent);
        $purpose->save();

        return $purpose;
    }

    // ----------[ Queries ]----------

    /**
     * The parent's own purpose in the project with that id for the profile; none when it belongs to another
     * project, parent or profile.
     */
    public static function findForParent(
        string $projectId,
        ActorReference $parent,
        string $profileKey,
        string $purposeId,
    ): self|null {
        return self::query()
            ->inProject($projectId)
            ->ownedBy($parent)
            ->ofProfile($profileKey)
            ->whereKey($purposeId)
            ->first();
    }

    public static function findFree(string $projectId, ActorReference $parent, string $profileKey, string $label): self
    {
        return self::start($projectId, $parent, $profileKey, PurposeType::Free, null, $label);
    }

    /**
     * The parent's purpose in the project for this profile about the subject.
     */
    public static function findOfSubject(
        string $projectId,
        ActorReference $parent,
        string $profileKey,
        RecordIdentity $subject,
    ): self {
        return self::query()
            ->inProject($projectId)
            ->ownedBy($parent)
            ->ofProfile($profileKey)
            ->aboutSubject($subject)
            ->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * The profile's purposes.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProfile(Builder $query, string $profileKey): void
    {
        $query->where('profile_key', $profileKey);
    }

    /**
     * The purposes about the subject.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function aboutSubject(Builder $query, RecordIdentity $subject): void
    {
        $query->where('subject_type', $subject->type)->where('subject_id', $subject->id);
    }

    /**
     * The purposes the same as this one: its profile's, about its subject, or under its label.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function likePurpose(Builder $query, self $purpose): void
    {
        $query->ofProfile($purpose->profile_key);

        if ($purpose->subject_id === null) {
            $query->where('label', $purpose->label);

            return;
        }

        $query->where('subject_type', $purpose->subject_type)->where('subject_id', $purpose->subject_id);
    }

    /**
     * The rows of the given subject.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSubject(Builder $query, string $subjectId): void
    {
        $query->where('subject_id', $subjectId);
    }

    /**
     * The rows of the given subject type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSubjectType(Builder $query, string $subjectType): void
    {
        $query->where('subject_type', $subjectType);
    }

    /**
     * The purposes of any holder that name the same work as this one: the same subject, or the same label.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function idsSameAs(Builder $query, self $purpose): void
    {
        $query->acrossActors()->likePurpose($purpose)->select('id');
    }
}
