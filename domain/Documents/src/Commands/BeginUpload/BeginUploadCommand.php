<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\BeginUpload;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(UploadPolicy::class, AccessType::Create)]
final readonly class BeginUploadCommand extends Command
{
    public const int MAX_BYTES = TextUpload::BYTE_LIMIT;

    public function __construct(
        public UploadType $type,
        public int $bytes,
        public string $digest,
    ) {}
}
