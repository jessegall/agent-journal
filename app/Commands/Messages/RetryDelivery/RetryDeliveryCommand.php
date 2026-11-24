<?php

declare(strict_types=1);

namespace App\Commands\Messages\RetryDelivery;

use App\Attributes\Authorize;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\MessageAdministrationPolicy;
use App\Support\Command;

/**
 * An operator asks again for one piece of chat text that was given up, under the same notification key: the piece is
 * outstanding once more and its delivery is due at once.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(MessageAdministrationPolicy::class, AccessType::Edit)]
final readonly class RetryDeliveryCommand extends Command
{
    public function __construct(public string $outstandingRangeId) {}
}
