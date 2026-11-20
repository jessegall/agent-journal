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
use Domain\Helpers\Handlers\ContinueHelperHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Support\HelperReceipt;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Launches another attempt at a helper's unfinished job on the model the parent names now; the job, its purpose,
 * brief, steering and source stay. A repeat of the request answers the same receipt.
 *
 * @extends Command<HelperReceipt>
 */
#[HandledBy(ContinueHelperHandler::class)]
#[Authorize(HelperPolicy::class, HelperAbility::Dispatch)]
#[Operation('continue_helper', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class ContinueHelper extends Command implements AuthorizedCommand
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
        public string|null $programKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return HelperJob::class;
    }
}
