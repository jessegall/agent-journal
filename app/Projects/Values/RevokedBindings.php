<?php

declare(strict_types=1);

namespace App\Projects\Values;

/**
 * What came of revoking each chosen binding, in the order they were chosen.
 */
final readonly class RevokedBindings
{
    /**
     * @param  list<BindingOutcome>  $outcomes
     */
    public function __construct(public array $outcomes) {}

    /**
     * Each binding's outcome by its id, as the window shows it beside the binding.
     *
     * @return array<string, string>
     */
    public function outcomesByBindingId(): array
    {
        $outcomesById = [];

        foreach ($this->outcomes as $each) {
            $outcomesById[$each->id] = $each->result;
        }

        return $outcomesById;
    }
}
