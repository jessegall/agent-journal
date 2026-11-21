<?php

declare(strict_types=1);

namespace App\Docking\Cards;

/**
 * Which source a placement docks: its registered type and its id, opaque to everyone but its owner.
 */
final readonly class DockIdentity
{
    public function __construct(public string $type, public string $id) {}
}
