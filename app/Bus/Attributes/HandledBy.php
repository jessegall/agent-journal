<?php

declare(strict_types=1);

namespace App\Bus\Attributes;

use Attribute;

/**
 * Names the one handler of a command.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class HandledBy
{
    /**
     * @param  class-string  $handler
     */
    public function __construct(public string $handler) {}
}
