<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(UploadPolicy::class, AccessType::Edit)]
final readonly class CommitUpload extends Command
{
    public function __construct(
        public string $uploadId,
    ) {}
}
