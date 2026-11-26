<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Actors\Contracts\Actor;
use Domain\Chat\Contracts\Docking\CardContext as CardContextContract;
use Domain\Chat\Contracts\Docking\DestinationGate;
use Domain\Chat\Support\Cards\DockDestination;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * A viewer's card context, offering only the pages the gate lets that viewer open.
 */
final readonly class CardContext implements CardContextContract
{
    public function __construct(private Actor $viewer, private DestinationGate $gate) {}

    public function permittedDestination(DockDestination $destination): Option
    {
        if ($this->gate->permits($this->viewer, $destination)) {
            return Some::create($destination);
        }

        return None::create();
    }
}
