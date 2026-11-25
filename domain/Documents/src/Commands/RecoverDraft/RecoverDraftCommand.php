<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\RecoverDraft;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Documents\Policies\DocumentPolicy;
use Domain\Documents\Values\DraftReference;

/**
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class RecoverDraftCommand extends Command
{
    public function __construct(public string $draftId, public int $expectedRevision) {}
}
