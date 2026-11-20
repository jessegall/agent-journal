<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Handlers\RecoverDraftHandler;
use Domain\Documents\Policies\DocumentPolicy;

/**
 * @extends Command<DraftReference>
 */
#[HandledBy(RecoverDraftHandler::class)]
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class RecoverDraft extends Command
{
    public function __construct(public string $draftId, public int $expectedRevision) {}
}
