<?php

declare(strict_types=1);

namespace Domain\Documents\Commands\CommentOnReport;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\CommentPolicy;
use App\Support\Command;

/**
 * @extends Command<string>
 */
#[Authorize(CommentPolicy::class, AccessType::Create)]
final readonly class CommentOnReportCommand extends Command
{
    public function __construct(public string $reportId, public string $body) {}
}
