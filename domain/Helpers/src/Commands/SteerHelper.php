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
use Domain\Helpers\Handlers\SteerHelperHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Support\SteerReceipt;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Adds steering to the named helper's live job without launching, choosing a model or changing its purpose; with no
 * live job the steering is kept with the command that would carry it.
 *
 * @extends Command<SteerReceipt>
 */
#[HandledBy(SteerHelperHandler::class)]
#[Authorize(HelperPolicy::class, HelperAbility::Dispatch)]
#[Operation('steer_helper', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class SteerHelper extends Command implements AuthorizedCommand
{
    public function __construct(
        #[Required]
        public string $identityId,
        #[Required]
        public string $text,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return HelperJob::class;
    }
}
