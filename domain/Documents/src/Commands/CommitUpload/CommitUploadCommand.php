<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CommitUpload;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(UploadPolicy::class, AccessType::Edit)]
final readonly class CommitUploadCommand extends Command
{
    public function __construct(
        public string $uploadId,
    ) {}
}
