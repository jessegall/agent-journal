<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $encoded_text
 */
#[Fillable(['upload_id', 'position', 'encoded_text'])]
final class TextUploadChunk extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    public static function create(TextUpload $upload, int $position, string $text): void
    {
        self::query()->create([
            'upload_id' => $upload->id,
            'position' => $position,
            'encoded_text' => base64_encode($text),
        ]);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<string, never>
     */
    protected function text(): Attribute
    {
        return Attribute::get(fn () => base64_decode($this->encoded_text));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<TextUpload, $this>
     */
    public function upload(): BelongsTo
    {
        return $this->belongsTo(TextUpload::class, 'upload_id');
    }
}
