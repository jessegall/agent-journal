<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Models;

use App\Comments\Contracts\Commentable;
use App\Comments\Support\HasComments;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Text\Contracts\TextContent;
use App\Text\Exceptions\TextVersionUnavailable;
use App\Text\Values\TextVersion;
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
    use BoundedReads, HasComments, HasNumber, HasUlids, Linkable;

    public const string LINK_TYPE = 'notes.page';

    public function textVersion(string|null $version = null): TextVersion
    {
        if ($version !== null && $version !== '1') {
            throw TextVersionUnavailable::named($version);
        }

        return TextVersion::ofMarkdown('1', 'page', $this->text);
    }

    public static function written(string $text): self
    {
        return self::query()->create(['text' => $text]);
    }

}
