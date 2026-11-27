<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios;

use Spatie\LaravelData\Data;

/**
 * A scenario file as it is written: its description and its steps, each step as its file spells it, checked one by
 * one by Scenario::read.
 */
final class ScenarioFile extends Data
{
    /**
     * @param  list<array<string, mixed>>  $steps
     */
    public function __construct(public readonly string $description = '', public readonly array $steps = []) {}
}
