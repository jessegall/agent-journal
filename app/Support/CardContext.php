<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Support\Cards\DockDestination;
use App\Support\Sources\Contracts\CardContext as CardContextContract;
use App\Support\Sources\Contracts\DestinationGate;
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
