<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CommentOnDocument;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Comments\Policies\CommentPolicy;
use App\Operations\Enums\AccessType;

/**
 * @extends Command<string>
 */
#[Authorize(CommentPolicy::class, AccessType::Create)]
final readonly class CommentOnDocumentCommand extends Command
{
    public function __construct(public string $documentId, public string $body) {}
}
