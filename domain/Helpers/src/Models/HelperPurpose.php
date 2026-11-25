<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use Domain\Helpers\Enums\PurposeType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * What a parent keeps a helper of one profile for: one record, or free work. A parent has at most one purpose per
 * profile and record.
 *
 * @property string $id
 * @property string $profile_key
 * @property PurposeType $purpose_type
 * @property string|null $subject_type
 * @property string|null $subject_id
 * @property-read Option<RecordIdentity> $subject_record
 * @property string $label
 */
#[Table('helper_purposes')]
#[Fillable([
    'profile_key',
    'purpose_type',
    'subject_type',
    'subject_id',
    'label',
])]
final class HelperPurpose extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['purpose_type' => PurposeType::class];
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
        ActorIdentity $parent,
        string $profileKey,
        PurposeType $type,
        RecordIdentity|null $subject,
        string $label,
    ): self {
        $purpose = new self();
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
     * The one purpose of the parent and profile for the record, made by the first of any concurrent starts; a later
     * start reads the one that won. Its label is the record's alias and id, never a fetched title.
     */
    public static function forSubjectOnce(ActorIdentity $parent, string $profileKey, RecordIdentity $subject): self
    {
        $purpose = new self([
            'profile_key' => $profileKey,
            'purpose_type' => PurposeType::Subject,
            'subject_type' => $subject->type,
            'subject_id' => $subject->id,
            'label' => "{$subject->type}:{$subject->id}",
        ]);

        $purpose->id = strtolower((string) Str::ulid());
        $purpose->belongTo($parent);
        $purpose->insertIfAbsent();

        return self::query()->ownedBy($parent)->ofProfile($profileKey)->aboutSubject($subject)->sole();
    }

    /**
     * The parent's own purpose with that id for the profile; none when it belongs to another parent or profile.
     */
    public static function ofParent(ActorIdentity $parent, string $profileKey, string $purposeId): self|null
    {
        return self::query()->ownedBy($parent)->ofProfile($profileKey)->whereKey($purposeId)->first();
    }

    public static function free(ActorIdentity $parent, string $profileKey, string $label): self
    {
        return self::start($parent, $profileKey, PurposeType::Free, null, $label);
    }

    /**
     * The purposes of any holder that name the same work as this one: the same subject, or the same label.
     *
     * @return Builder<self>
     */
    public static function sameAs(self $purpose): Builder
    {
        return self::query()->acrossActors()->likePurpose($purpose);
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
}
