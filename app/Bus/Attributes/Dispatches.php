<?php

declare(strict_types=1);

namespace App\Bus\Attributes;

use App\Bus\Contracts\Command;
use Attribute;

/**
 * A command a write tool or a controller action may send to the bus; an action names each it may send.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final readonly class Dispatches
{
    /**
     * @param  class-string<Command<mixed>>  $command
     */
    public function __construct(public string $command) {}
}
