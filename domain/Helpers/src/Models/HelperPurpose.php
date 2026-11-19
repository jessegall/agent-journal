<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Domain\Helpers\Enums\PurposeType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

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
    use BelongsToOneActor, BoundedReads, HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['purpose_type' => PurposeType::class];
    }

    public static function forSubject(ActorIdentity $parent, string $profileKey, RecordIdentity $subject, string $label): self
    {
        return self::start($parent, $profileKey, PurposeType::Subject, $subject, $label);
    }

    public static function free(ActorIdentity $parent, string $profileKey, string $label): self
    {
        return self::start($parent, $profileKey, PurposeType::Free, null, $label);
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
}
