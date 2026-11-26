<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CommentOnReport;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Comments\Policies\CommentPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(CommentPolicy::class, AccessType::Create)]
final readonly class CommentOnReportCommand extends Command
{
    public function __construct(public string $reportId, public string $body) {}
}
