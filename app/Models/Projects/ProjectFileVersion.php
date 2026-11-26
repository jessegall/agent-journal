<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $project_file_id
 * @property string $digest
 * @property string $text
 * @property int $line_count
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
#[Table('project_file_versions')]
final class ProjectFileVersion extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;

    /**
     * How many of a file's versions no comment names are kept, newest first.
     */
    public const int KEPT_UNNAMED_VERSION_LIMIT = 3;

    protected function casts(): array
    {
        return [
            'line_count' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(ProjectFile $file, string $digest, string $text): self
    {
        $version = new self();
        $version->project_file_id = $file->id;
        $version->digest = $digest;
        $version->text = $text;
        $version->line_count = substr_count(str_replace("\r\n", "\n", $text), "\n") + 1;
        $version->save();

        return $version;
    }

    // ----------[ Scopes ]----------

    /**
     * The version of that digest.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDigest(Builder $query, string $digest): void
    {
        $query->where('digest', $digest);
    }

    /**
     * The version of that digest; every version with none named.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDigestWhenNamed(Builder $query, string|null $digest): void
    {
        $query->when($digest !== null, fn (Builder $named) => $named->where('digest', $digest));
    }

    /**
     * The versions of each file older than the newest ones it keeps.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pastKeptLimit(Builder $query): void
    {
        $newest = self::query()
            ->selectRaw('id, row_number() over (partition by project_file_id order by created_at desc, id desc) as place');

        $query->whereNotIn('id', fn ($kept) => $kept->fromSub($newest, 'ranked')
            ->where('place', '<=', self::KEPT_UNNAMED_VERSION_LIMIT)
            ->select('id'));
    }
}
