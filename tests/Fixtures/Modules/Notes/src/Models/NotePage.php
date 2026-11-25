<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Models;

use App\Contracts\Records\Commentable;
use App\Concerns\Linkable;
use App\Contracts\Records\Numbered;
use App\Concerns\HasNumber;
use App\Contracts\Records\ReadableModel;
use App\Concerns\BoundedReads;
use App\Contracts\Reads\TextContent;
use App\Values\TextVersion;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A page of notes with text in one version, which takes comments about the whole page or a place in its text. Its text
 * has one version, 1.
 *
 * @property string $id
 * @property int $number
 * @property string $text
 */
#[Fillable(['text'])]
#[Table('module_note_pages')]
final class NotePage extends Model implements Commentable, Numbered, ReadableModel, TextContent
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;

    public function textVersion(string|null $version = null): TextVersion
    {
        return TextVersion::ofOnlyMarkdown($version, 'page', $this->text);
    }

    public static function written(string $text): self
    {
        return self::query()->create(['text' => $text]);
    }

}
