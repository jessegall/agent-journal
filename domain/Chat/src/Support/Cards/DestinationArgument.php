<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

/**
 * One route argument of a declared page a card opens.
 */
final readonly class DestinationArgument
{
    public function __construct(public string $name, public string $value) {}
}
