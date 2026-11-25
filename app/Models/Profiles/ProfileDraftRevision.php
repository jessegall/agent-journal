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
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property int $revision
 * @property string $source
 * @property array<string, mixed> $commands
 */
#[Fillable([
    'profile_key',
    'revision',
    'source',
    'commands',
    'author_type',
    'author_id',
])]
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
        return self::query()->create([
            'profile_key' => $draft->profile_key,
            'revision' => $draft->revision + 1,
            'source' => $script->text,
            'commands' => $script->definitions(),
            'author_type' => $author->type,
            'author_id' => $author->id,
        ]);
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
