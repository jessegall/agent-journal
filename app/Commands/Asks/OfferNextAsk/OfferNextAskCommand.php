<?php

declare(strict_types=1);

namespace App\Commands\Asks\OfferNextAsk;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AskPolicy;
use App\Support\Command;

/**
 * Offers the holder of a closed hop the next ask that waits for it, once its answering frame has settled.
 *
 * @extends Command<null>
 */
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class OfferNextAskCommand extends Command
{
    public function __construct(public string $hopId) {}
}
