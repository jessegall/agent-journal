<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use Attribute;

/**
 * A machinery test names the engine class it proves: the bus, the stack engine, the hook pipeline, shell admission.
 * Never a command, handler, controller, state or MCP tool, whose proofs belong in that entry's test.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class TestsMachinery
{
    /**
     * @param  string  $subject  the engine class, by its full name; one that does not exist fails the machinery check
     */
    public function __construct(public string $subject) {}
}
