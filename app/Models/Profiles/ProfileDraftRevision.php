<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Concerns\PreventsRevisionUpdates;
use App\Models\Support\Accessor;
use App\Support\ActorIdentity;
use App\Values\ScriptSource;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $profile_key
 * @property int $revision
 * @property string $source
 * @property array $commands
 * @property ActorType $author_type
 * @property string $author_id
 * @property Carbon $created_at
 * @property mixed $script_source attribute
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
            'commands' => 'array',
            'author_type' => ActorType::class,
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(ProfileDraft $draft, ScriptSource $script, ActorIdentity $author): self
    {
        $profileDraftRevision = new self();
        $profileDraftRevision->profile_key = $draft->profile_key;
        $profileDraftRevision->revision = $draft->revision + 1;
        $profileDraftRevision->source = $script->text;
        $profileDraftRevision->commands = $script->definitions();
        $profileDraftRevision->author_type = $author->type;
        $profileDraftRevision->author_id = $author->id;
        $profileDraftRevision->save();

        return $profileDraftRevision;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ScriptSource, never>
     */
    protected function scriptSource(): Attribute
    {
        return Accessor::get(fn () => ScriptSource::fromDefinitions($this->source, $this->commands));
    }
}
