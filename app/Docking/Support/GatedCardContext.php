<?php

declare(strict_types=1);

namespace App\Docking\Support;

use App\Actors\Contracts\Actor;
use App\Docking\Cards\DockDestination;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\DestinationGate;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * A viewer's card context, offering only the pages the gate lets that viewer open.
 */
final readonly class GatedCardContext implements CardContext
{
    public function __construct(private Actor $viewer, private DestinationGate $gate) {}

    public function permittedDestination(DockDestination $destination): Option
    {
        return $this->gate->permits($this->viewer, $destination) ? Some::create($destination) : None::create();
    }
}
