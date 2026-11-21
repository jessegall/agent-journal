<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Policies\DocumentPolicy;

/**
 * @extends Command<DraftReference>
 */
#[Authorize(DocumentPolicy::class, AccessType::Edit)]
final readonly class RecoverDraft extends Command
{
    public function __construct(public string $draftId, public int $expectedRevision) {}
}
