<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Records\Contracts\RecordResolver;
use App\Records\Contracts\RecordSummaries;
use Domain\Chat\Contracts\Docking\FallbackDocks as FallbackDocksContract;
use Domain\Chat\Exceptions\DockDefinitionInvalid;
use Domain\Chat\Values\DockDefinition;

/**
 * Every record whose owner summarizes it docks as that summary, and every other record type with its link card.
 */
final readonly class FallbackDocks implements FallbackDocksContract
{
    public function __construct(private RecordResolver $records, private RecordSummaries $summaries) {}

    public function covers(string $type): bool
    {
        return $this->summaries->covers($type) || in_array($type, $this->records->types(), true);
    }

    public function definition(string $type): DockDefinition
    {
        if ($this->summaries->covers($type)) {
            return new DockDefinition($type, SummaryDockable::class, SummaryDockableProvider::class);
        }

        if (! $this->covers($type)) {
            throw DockDefinitionInvalid::unknown($type);
        }

        return new DockDefinition($type, LinkCardDockable::class, LinkCardDockableProvider::class);
    }
}
