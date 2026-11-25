<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Contracts\Bus\CommandMiddleware;
use Attribute;

/**
 * The command middleware a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsMiddleware
{
    /**
     * @param  class-string<CommandMiddleware>  $middleware
     */
    public function __construct(public string $middleware) {}
}
