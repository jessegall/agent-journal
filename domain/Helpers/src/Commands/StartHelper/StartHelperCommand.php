<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\StartHelper;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Enums\Drivers\DriverType;
use App\Support\Command;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Gives new work to one of the caller's helpers of a profile, the best one that may take it or a new one, on the
 * model it names or the profile's default, and starts it.
 *
 * @extends Command<HelperReceipt>
 */
#[Authorize(HelperPolicy::class, AccessType::Create)]
final readonly class StartHelperCommand extends Command
{
    public function __construct(
        #[Required]
        public string $requestId,
        #[Required]
        public string $profileKey,
        #[Required]
        public string $model,
        public string|null $driverKey,
        public HelperWork $work,
        public DriverType|null $driverType = null,
    ) {}
}
