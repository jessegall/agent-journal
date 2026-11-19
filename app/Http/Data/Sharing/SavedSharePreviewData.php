<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use App\Http\Data\Support\OptionalOrMissing;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\ShareSelectedTarget;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The owner's last saved preview of a root that is still open: its id and checksum to confirm it with, the records
 * it selected and when it expires.
 */
#[TypeScript]
final class SavedSharePreviewData extends Data
{
    use OptionalOrMissing;

    /**
     * @param  list<string>  $selectedIds
     */
    public function __construct(
        public readonly string $id,
        public readonly string $checksum,
        public readonly array $selectedIds,
        public readonly string $expiresAt,
    ) {}

    public static function fromPreview(SharePreview $preview): self
    {
        return new self(
            $preview->id,
            $preview->checksum,
            array_map(fn (ShareSelectedTarget $target) => $target->record->id, $preview->selection),
            $preview->expires_at->toIso8601String(),
        );
    }
}
