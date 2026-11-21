<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * The object a call runs on: where it comes from, and its class where the code names it.
 */
final readonly class Receiver
{
    public function __construct(public ReceiverOrigin $origin, public string|null $class = null) {}

    public static function unknown(): self
    {
        return new self(ReceiverOrigin::Unknown);
    }
}
