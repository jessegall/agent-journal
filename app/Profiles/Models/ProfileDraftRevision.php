<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Profiles\Models\Concerns\PreventsRevisionUpdates;
use App\Profiles\Values\ScriptSource;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property int $revision
 * @property string $source
 * @property array<string, mixed> $commands
 */
#[Fillable(['profile_key', 'revision', 'source', 'commands', 'author_type', 'author_id'])]
final class ProfileDraftRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use PreventsRevisionUpdates;

    public const string LINK_TYPE = 'core.profile-draft-revision';

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return ['revision' => 'integer', 'commands' => 'array', 'author_type' => ActorType::class];
    }

    public static function appendTo(ProfileDraft $draft, ScriptSource $script, ActorIdentity $author): self
    {
        return self::query()->create([
            'profile_key' => $draft->profile_key,
            'revision' => $draft->revision + 1,
            'source' => $script->text,
            'commands' => $script->definitions(),
            'author_type' => $author->type,
            'author_id' => $author->id,
        ]);
    }

    // ----------[ Answers ]----------

    public function scriptSource(): ScriptSource
    {
        return ScriptSource::fromDefinitions($this->source, $this->commands);
    }
}
