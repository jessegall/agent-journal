<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Contracts\Actor;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\DestinationGate;
use App\Support\GatedCardContext;
use App\Support\Cards\DockDestination;

/**
 * A gate that lets every viewer open every page, for tests that are not about access.
 */
final readonly class OpenGate implements DestinationGate
{
    public function permits(Actor $viewer, DockDestination $destination): bool
    {
        return true;
    }

    public function contextFor(Actor $viewer): CardContext
    {
        return new GatedCardContext($viewer, $this);
    }
}
