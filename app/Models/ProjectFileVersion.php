<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One version of a connected project's file, as its host read it whole: the text and its sha256 digest, kept so a
 * comment on its lines points at exactly this text.
 *
 * @property string $id
 * @property string $project_file_id
 * @property string $digest
 * @property string $text
 * @property int $line_count
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['digest'])]
#[Table('project_file_versions')]
final class ProjectFileVersion extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'projects.file-version';

    /**
     * How many of a file's versions no comment names are kept, newest first.
     */
    public const int KEPT_UNNAMED_VERSION_LIMIT = 3;

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'line_count' => 'integer',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

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
}
