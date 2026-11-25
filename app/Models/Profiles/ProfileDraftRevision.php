<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Concerns\PreventsRevisionUpdates;
use App\Support\ActorReference;
use App\Values\ScriptSource;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $profile_key
 * @property int $revision
 * @property ScriptSource $script_source
 * @property string $author_type
 * @property string $author_id
 * @property CarbonImmutable $created_at
 *
 * @mixin \Eloquent
 */
final class ProfileDraftRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use PreventsRevisionUpdates;

    public const null UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'revision' => 'integer',
            'script_source' => ScriptSource::class,
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(ProfileDraft $draft, ScriptSource $script, ActorReference $author): self
    {
        $profileDraftRevision = new self();
        $profileDraftRevision->profile_key = $draft->profile_key;
        $profileDraftRevision->revision = $draft->revision + 1;
        $profileDraftRevision->script_source = $script;
        $profileDraftRevision->author_type = $author->type;
        $profileDraftRevision->author_id = $author->id;
        $profileDraftRevision->save();

        return $profileDraftRevision;
    }
}
