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
use Domain\Documents\Handlers\AppendUploadHandler;
use Domain\Documents\Models\Document;
use Domain\Documents\Policies\DocumentAdministrationPolicy;

/** @extends Command<void> */
#[HandledBy(AppendUploadHandler::class)]
#[Authorize(DocumentAdministrationPolicy::class, DocumentAbility::Work)]
#[Operation('append_upload', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class AppendUpload extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $uploadId,
        public int $index,
        public string $text,
        public string $digest,
    ) {}

    public function subject(): string
    {
        return Document::class;
    }
}
