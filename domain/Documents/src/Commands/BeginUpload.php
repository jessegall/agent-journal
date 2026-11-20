<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Documents\Enums\DocumentAbility;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Handlers\BeginUploadHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/**
 * @extends Command<string>
 */
#[HandledBy(BeginUploadHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('begin_upload', ResourceAreaType::JournalContent, AccessType::Create)]
final readonly class BeginUpload extends Command implements AuthorizedCommand
{
    public const int MAX_BYTES = TextUpload::MAX_BYTES;

    public function __construct(
        public UploadType $type,
        public int $bytes,
        public string $digest,
    ) {}

    public function subject(): string
    {
        return Document::class;
    }
}
