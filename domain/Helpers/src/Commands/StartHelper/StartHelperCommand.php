<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\StartHelper;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Projects\Contracts\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Gives new work in the project to one of the caller's helpers there of a profile, the best one that may take it or
 * a new one, on the model it names or the profile's default, and starts it.
 *
 * @extends Command<HelperReceipt>
 */
#[Authorize(HelperPolicy::class, AccessType::Create)]
final readonly class StartHelperCommand extends Command implements ProjectCommand
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
        public string $projectId,
        public DriverType|null $driverType = null,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
