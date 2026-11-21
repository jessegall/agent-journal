<?php

declare(strict_types=1);

namespace App\Records\Docking;

use App\Docking\Exceptions\DockDefinitionInvalid;
use App\Docking\Sources\Contracts\FallbackDocks;
use App\Docking\Sources\DockDefinition;
use App\Records\Contracts\RecordResolver;

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

        return new DockDefinition($type, LegacyDockable::class, LegacyDockableProvider::class);
    }
}
