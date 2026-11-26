<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Bus\Contracts\CommandMiddleware;
use Attribute;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * The command middleware a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsMiddleware implements NamesEntry
{
    /**
     * @param  class-string<CommandMiddleware>  $middleware
     */
    public function __construct(public string $middleware) {}

    public function entryName(): string
    {
        return $this->middleware;
    }
}
