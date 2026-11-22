<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Values;

/**
 * A value a command carries, wrongly with a property that can change after the command is made.
 */
final class MutableLabel
{
    public function __construct(public string $text) {}
}
