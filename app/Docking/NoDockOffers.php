<?php

declare(strict_types=1);

namespace App\Docking;

use App\Docking\Sources\Contracts\DockOffers;
use App\Support\Cards\DockIdentity;
use PhpOption\None;
use PhpOption\Option;

/**
 * No dock is offered anywhere, for a journal with no domain that docks sources.
 */
final readonly class NoDockOffers implements DockOffers
{
    public function offerFor(DockIdentity $source): Option
    {
        return None::create();
    }
}
