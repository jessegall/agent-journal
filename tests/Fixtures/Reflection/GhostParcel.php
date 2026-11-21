<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

/**
 * A class built as a lazy ghost by the reflection tests.
 */
final class GhostParcel
{
    public string $label = '';

    public function __construct(string $label)
    {
        $this->label = $label;
    }
}
