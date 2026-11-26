<?php

declare(strict_types=1);

namespace App\Asks\Commands\OfferNextAsk;

use App\Asks\AskAttention;
use App\Bus\Contracts\CommandHandler;
use App\Models\Asks\AskHop;

final readonly class OfferNextAskHandler implements CommandHandler
{
    public function __construct(private AskAttention $attention) {}

    public function handle(OfferNextAskCommand $command): void
    {
        $hop = AskHop::query()->whereKey($command->hopId)->readExactly(1)->sole();
        $this->attention->offerNext($hop->actor());
    }
}
