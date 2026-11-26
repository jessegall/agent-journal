<?php

declare(strict_types=1);

namespace App\Docking\Cards;

/**
 * One route argument of a declared page a card opens.
 */
final readonly class DestinationArgument
{
    public function __construct(public string $name, public string $value) {}
}
