<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Reads\Attributes\ReadBudget;
use App\Reads\Contracts\ReadMeter;
use App\Reads\Values\ReadCounts;
use ReflectionMethod;

/**
 * Asserts a reader call stays within the ReadBudget its method declares, and reads the counts of any call.
 */
trait AssertsReadBudget
{
    /**
     * @param  callable(): mixed  $call
     * @param  array{0: class-string, 1: string}  $method  the reader method whose ReadBudget applies
     */
    protected function assertWithinReadBudget(callable $call, array $method): void
    {
        $attributes = new ReflectionMethod($method[0], $method[1])->getAttributes(ReadBudget::class);
        $this->assertNotSame([], $attributes, "{$method[0]}::{$method[1]} declares no ReadBudget.");
        $budget = $attributes[0]->newInstance();
        $counts = $this->readCounts($call);

        $this->assertLessThanOrEqual($budget->queries, $counts->queriesRun, "{$method[0]}::{$method[1]} ran more queries than its budget.");
        $this->assertLessThanOrEqual($budget->models, $counts->modelsLoaded, "{$method[0]}::{$method[1]} loaded more models than its budget.");
    }

    /**
     * @param  callable(): mixed  $call
     */
    protected function readCounts(callable $call): ReadCounts
    {
        return $this->app->make(ReadMeter::class)->measure('test', $call)->counts;
    }
}
