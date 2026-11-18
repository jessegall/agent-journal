<?php

declare(strict_types=1);

namespace Domain\Documents\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use Domain\Documents\Handlers\CommentReportHandler;
use Domain\Documents\Support\CommentAnchor;

/**
 * A user comments on a report, in general or on an exact quote of one revision; agents cannot comment.
 *
 * @implements Command<null>
 */
#[HandledBy(CommentReportHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class CommentReport implements Command
{
    public function __construct(
        public int $reportNumber,
        public string $body,
        public CommentAnchor|null $anchor = null,
    ) {}
}
