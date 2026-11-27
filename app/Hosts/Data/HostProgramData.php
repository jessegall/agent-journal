<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Data;

/**
 * A program the journal ships into a session, with the arguments it takes after its own name, in order.
 */
final class HostProgramData extends Data
{
    /**
     * @param  list<string>  $arguments
     */
    public function __construct(public readonly string $about, public readonly array $arguments) {}
}
