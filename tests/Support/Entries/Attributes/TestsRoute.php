<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use Attribute;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * A route method a test class is the one test of, by its HTTP method and route name.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class TestsRoute implements NamesEntry
{
    /**
     * @param  string  $method  GET, POST, PUT, PATCH or DELETE, as the router holds it; HEAD is never named
     */
    public function __construct(public string $method, public string $name) {}

    public function entryName(): string
    {
        return "{$this->method} {$this->name}";
    }
}
