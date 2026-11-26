<?php

declare(strict_types=1);

namespace App\Asks\Commands\OfferNextAsk;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
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
