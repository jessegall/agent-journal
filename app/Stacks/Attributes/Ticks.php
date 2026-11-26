<?php

declare(strict_types=1);

namespace App\Stacks\Attributes;

use App\Stacks\Contracts\Work\WorkOccurrenceGuard;
use Attribute;

/**
 * Marks a state that ticks, about once a second, with the guard that checks its work is still live, so a tick of
 * finished work commits nothing.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Ticks
{
    /**
     * @param  class-string<WorkOccurrenceGuard>  $guard
     */
    public function __construct(public string $guard) {}
}
