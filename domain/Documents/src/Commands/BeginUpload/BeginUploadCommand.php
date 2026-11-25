<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\BeginUpload;

use App\Attributes\Commands\Authorize;
use App\Contracts\Projects\ProjectCommand;
use App\Enums\Agents\AccessType;
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
