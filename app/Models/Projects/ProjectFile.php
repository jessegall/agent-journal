<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Reads\TextContent;
use App\Contracts\Records\Commentable;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\TextVersionUnavailable;
use App\Models\Support\BelongsToProject;
use App\Values\TextVersion;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $binding_id
 * @property string $project_id
 * @property string $path
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, ProjectFileVersion> $versions
 * @property-read int|null $versions_count
 *
 * @mixin \Eloquent
 */
#[Table('project_files')]
final class ProjectFile extends Model implements Commentable, Numbered, ProjectOwned, ReadableModel, TextContent
{
    use BelongsToProject;
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;

    protected function casts(): array
    {
        return [
            'number' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A file of the connected folder its host read whole for the first time, of the binding's project.
     */
    public static function create(ProjectBinding $binding, string $path): self
    {
        $file = new self();
        $file->binding_id = $binding->id;
        $file->project_id = $binding->project_id;
        $file->path = $path;
        $file->save();

        return $file;
    }

    // ----------[ Transformers ]----------

    /**
     * The kept version with this digest, if the file was read with it before.
     *
     * @return Option<ProjectFileVersion>
     */
    public function versionWith(string $digest): Option
    {
        return $this->versions()->withDigest($digest)->firstOption();
    }

    /**
     * The version with this digest, or the newest when none is named.
     *
     * @throws TextVersionUnavailable
     */
    public function textVersion(string|null $version = null): TextVersion
    {
        $kept = $this->versions()
            ->withDigestWhenNamed($version)
            ->newestFirst()
            ->firstOr(TextVersionUnavailable::throwing()->named($version ?? 'current'));

        return TextVersion::from([
            'id' => $kept->digest,
            'label' => 'Version '.substr($kept->digest, 0, 8),
            'text' => $kept->text,
            'sections' => [],
        ]);
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<ProjectFileVersion, $this>
     */
    public function versions(): HasMany
    {
        return $this->hasMany(ProjectFileVersion::class);
    }

    // ----------[ Queries ]----------

    /**
     * The file at this path of the connected folder, if its host ever read it whole.
     *
     * @return Option<self>
     */
    public static function findAtPath(string $bindingId, string $path): Option
    {
        return self::query()->atPathOf($bindingId, $path)->firstOption();
    }

    // ----------[ Scopes ]----------

    /**
     * The binding's file at the path.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function atPathOf(Builder $query, string $bindingId, string $path): void
    {
        $query->where('binding_id', $bindingId)->where('path', $path);
    }
}
