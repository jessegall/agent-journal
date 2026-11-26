<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\AppendUpload;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<void>
 */
#[Authorize(UploadPolicy::class, AccessType::Edit)]
final readonly class AppendUploadCommand extends Command
{
    public const int MAX_BYTES = TextUpload::CHUNK_BYTES;

    public function __construct(
        public string $uploadId,
        public int $index,
        public string $text,
        public string $digest,
    ) {}
}
