<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<void>
 */
#[Authorize(UploadPolicy::class, AccessType::Edit)]
final readonly class AppendUpload extends Command
{
    public const int MAX_BYTES = TextUpload::CHUNK_BYTES;

    public function __construct(
        public string $uploadId,
        public int $index,
        public string $text,
        public string $digest,
    ) {}
}
