<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Helpers\Handlers\MarkHelperJobUnfinishedHandler;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Marks an open helper job unfinished once its helper stopped before the job was done, and tells the parent how to
 * continue it. Run by the journal after the launch ended.
 *
 * @extends Command<null>
 */
#[HandledBy(MarkHelperJobUnfinishedHandler::class)]
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class MarkHelperJobUnfinished extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
    ) {}
}
