<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $encoded_text
 */
#[Fillable(['upload_id', 'position', 'encoded_text'])]
final class TextUploadChunk extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    // ----------[ Constructors ]----------

    public static function store(TextUpload $upload, int $position, string $text): void
    {
        self::query()->create([
            'upload_id' => $upload->id,
            'position' => $position,
            'encoded_text' => base64_encode($text),
        ]);
    }

    // ----------[ Answers ]----------

    public function text(): string
    {
        return base64_decode($this->encoded_text);
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
