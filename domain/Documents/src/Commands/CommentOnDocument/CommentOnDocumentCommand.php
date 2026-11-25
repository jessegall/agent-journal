<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CommentOnDocument;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Comments\Policies\CommentPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(CommentPolicy::class, AccessType::Create)]
final readonly class CommentOnDocumentCommand extends Command
{
    public function __construct(public string $documentId, public string $body) {}
}
