<?php

declare(strict_types=1);

namespace App\Support\Docking;

use App\Contracts\Records\RecordResolver;
use App\Exceptions\DockDefinitionInvalid;
use App\Support\Sources\Contracts\FallbackDocks;
use App\Support\Sources\DockDefinition;

/**
 * Every record type docks with its record card until its owner registers a card of its own.
 */
final readonly class RecordFallbackDocks implements FallbackDocks
{
    public function __construct(private RecordResolver $records) {}

    public function covers(string $type): bool
    {
        return in_array($type, $this->records->types(), true);
    }

    public function definition(string $type): DockDefinition
    {
        if (! $this->covers($type)) {
            throw DockDefinitionInvalid::unknown($type);
        }

        return new DockDefinition($type, LinkCardDockable::class, LinkCardDockableProvider::class);
    }
}
