<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\DiscardUpload;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<void>
 */
#[Authorize(UploadPolicy::class, AccessType::Edit)]
final readonly class DiscardUploadCommand extends Command
{
    public function __construct(
        public string $uploadId,
    ) {}
}
