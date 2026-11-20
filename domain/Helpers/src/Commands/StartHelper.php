<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Helpers\Enums\HelperAbility;
use Domain\Helpers\Handlers\StartHelperHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Support\HelperWork;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Gives new work to one of the caller's helpers of a profile, the best one that may take it or a new one, on the
 * model it names or the profile's default, and launches it.
 *
 * @extends Command<HelperReceipt>
 */
#[HandledBy(StartHelperHandler::class)]
#[Authorize(HelperPolicy::class, HelperAbility::Dispatch)]
#[Operation('start_helper', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class StartHelper extends Command implements AuthorizedCommand
{
    public function __construct(
        #[Required]
        public string $requestId,
        #[Required]
        public string $profileKey,
        #[Required]
        public string $model,
        public string|null $programKey,
        public HelperWork $work,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return HelperJob::class;
    }
}
