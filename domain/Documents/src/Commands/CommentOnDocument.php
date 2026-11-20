<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Comments\Policies\CommentPolicy;
use App\Operations\Enums\AccessType;
use Domain\Documents\Handlers\CommentOnDocumentHandler;

/**
 * @extends Command<string>
 */
#[HandledBy(CommentOnDocumentHandler::class)]
#[Authorize(CommentPolicy::class, AccessType::Create)]
final readonly class CommentOnDocument extends Command
{
    public function __construct(public string $documentId, public string $body) {}
}
