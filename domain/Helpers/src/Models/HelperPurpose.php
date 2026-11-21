<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\Support\InsertsAbsentRows;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Domain\Helpers\Enums\PurposeType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * What a parent keeps a helper of one profile for: one record, or free work. A parent has at most one purpose per
 * profile and record.
 *
 * @property string $id
 * @property string $profile_key
 * @property PurposeType $purpose_type
 * @property string|null $subject_type
 * @property string|null $subject_id
 * @property string $label
 */
#[Table('helper_purposes')]
#[Fillable(['profile_key', 'purpose_type', 'subject_type', 'subject_id', 'label'])]
final class HelperPurpose extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['purpose_type' => PurposeType::class];
    }

    // ----------[ Queries ]----------

    public static function forSubject(
        ActorIdentity $parent,
        string $profileKey,
        RecordIdentity $subject,
        string $label,
    ): self {
        return self::start($parent, $profileKey, PurposeType::Subject, $subject, $label);
    }

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

        return self::query()->ownedBy($parent)
            ->where('profile_key', $profileKey)
            ->where('subject_type', $subject->type)
            ->where('subject_id', $subject->id)
            ->sole();
    }

    /**
     * The parent's own purpose with that id for the profile; none when it belongs to another parent or profile.
     */
    public static function ofParent(ActorIdentity $parent, string $profileKey, string $purposeId): self|null
    {
        return self::query()->ownedBy($parent)->where('profile_key', $profileKey)->whereKey($purposeId)->first();
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
        $same = self::query()->acrossActors()->where('profile_key', $purpose->profile_key);

        return $purpose->subject_id === null
            ? $same->where('label', $purpose->label)
            : $same->where('subject_type', $purpose->subject_type)->where('subject_id', $purpose->subject_id);
    }

    // ----------[ Internals ]----------

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
}
