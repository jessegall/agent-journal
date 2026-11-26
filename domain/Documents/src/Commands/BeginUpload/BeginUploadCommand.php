<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\BeginUpload;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Projects\Contracts\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Policies\UploadPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(UploadPolicy::class, AccessType::Create)]
final readonly class BeginUploadCommand extends Command implements ProjectCommand
{
    public const int MAX_BYTES = TextUpload::BYTE_LIMIT;

    public function __construct(
        public UploadType $type,
        public int $bytes,
        public string $digest,
        public string $projectId,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
