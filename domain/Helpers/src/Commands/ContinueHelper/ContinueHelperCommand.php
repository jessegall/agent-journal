<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\ContinueHelper;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Values\HelperReceipt;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Starts another attempt at a helper's unfinished job on the model the parent names now; the job, its purpose,
 * brief, steering and source stay. A repeat of the request answers the same receipt.
 *
 * @extends Command<HelperReceipt>
 */
#[Authorize(HelperPolicy::class, AccessType::Create)]
final readonly class ContinueHelperCommand extends Command
{
    public function __construct(
        #[Required]
        public string $requestId,
        #[Required]
        public string $identityId,
        #[Required]
        public string $jobId,
        #[Required]
        public string $model,
        public string|null $driverKey,
    ) {}
}
