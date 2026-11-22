<?php

declare(strict_types=1);

namespace App\Mcp\Attributes;

use App\Contracts\Command;
use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Dispatches
{
    /**
     * @param  class-string<Command<mixed>>  $command
     */
    public function __construct(public string $command) {}
}
