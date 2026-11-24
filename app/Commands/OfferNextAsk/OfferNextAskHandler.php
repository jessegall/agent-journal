<?php

declare(strict_types=1);

namespace App\Commands\OfferNextAsk;

use App\Contracts\Bus\CommandHandler;
use App\Models\Asks\AskHop;
use App\Support\AskAttention;

final readonly class OfferNextAskHandler implements CommandHandler
{
    public function __construct(private AskAttention $attention) {}

    public function handle(OfferNextAskCommand $command): void
    {
        $hop = AskHop::query()->whereKey($command->hopId)->readExactly(1)->sole();
        $this->attention->offerNext($hop->actor());
    }
}
