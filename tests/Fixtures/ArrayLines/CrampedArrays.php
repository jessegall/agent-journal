<?php

declare(strict_types=1);

namespace Tests\Fixtures\ArrayLines;

/**
 * Arrays the array lines scan lists (an argument, a return, a property default) beside those it leaves alone.
 */
final class CrampedArrays
{
    private array $sizes = ['small', 'large'];

    public function sizes(string $size): bool
    {
        $known = ['small', 'large'];
        [$first, $second] = $known;

        return in_array($size, ['small', 'large'], true) && in_array($first, [$second], true);
    }

    public function pair(): array
    {
        return ['left' => 1, 'right' => 2];
    }
}
