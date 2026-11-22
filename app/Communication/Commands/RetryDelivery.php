<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessageAdministrationPolicy;
use App\Operations\Enums\AccessType;

/**
 * An operator asks again for one piece of chat text that was given up, under the same notification key: the piece is
 * outstanding once more and its delivery is due at once.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(MessageAdministrationPolicy::class, AccessType::Edit)]
final readonly class RetryDelivery extends Command
{
    public function __construct(public string $outstandingRangeId) {}
}
