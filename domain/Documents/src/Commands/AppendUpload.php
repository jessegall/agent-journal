<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Handlers\AppendUploadHandler;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<void>
 */
#[HandledBy(AppendUploadHandler::class)]
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
