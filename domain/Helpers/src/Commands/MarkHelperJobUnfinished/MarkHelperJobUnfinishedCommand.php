<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\MarkHelperJobUnfinished;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Marks an open helper job unfinished once its helper stopped before the job was done, and tells the parent how to
 * continue it. Run by the journal after the launch ended.
 *
 * @extends Command<null>
 */
#[Authorize(HelperPolicy::class, AccessType::Edit)]
final readonly class MarkHelperJobUnfinishedCommand extends Command
{
    public function __construct(
        #[Required]
        public string $jobId,
    ) {}
}
