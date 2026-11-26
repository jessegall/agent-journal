<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts\Docking;

use Domain\Chat\Support\Cards\DockDestination;
use PhpOption\Option;

/**
 * What a card is composed for: the pages its viewer may open from it.
 */
interface CardContext
{
    /**
     * @return Option<DockDestination>
     */
    public function permittedDestination(DockDestination $destination): Option;
}
