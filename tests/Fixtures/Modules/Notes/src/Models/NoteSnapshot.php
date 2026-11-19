<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Models;

use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Text\Contracts\TextContent;
use App\Text\Values\TextVersion;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A snapshot of notes whose text can be read but takes no comments. Its text has one version, 1.
 *
 * @property string $id
 * @property int $number
 * @property string $text
 */
#[Fillable(['text'])]
#[Table('module_note_snapshots')]
final class NoteSnapshot extends Model implements Numbered, ReadableModel, TextContent
{
    use BoundedReads, HasNumber, HasUlids, Linkable;

    public const string LINK_TYPE = 'notes.snapshot';

    public function textVersion(string|null $version = null): TextVersion
    {
        return TextVersion::ofOnlyMarkdown($version, 'snapshot', $this->text);
    }

    public static function written(string $text): self
    {
        return self::query()->create(['text' => $text]);
    }

}
