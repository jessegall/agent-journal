<?php

declare(strict_types=1);

namespace Tests\Fixtures\ArrayLines;

/**
 * Arrays the array lines scan lists (a return, a property default, an argument split though it fits one line) beside
 * those it leaves alone: an argument that fits its line, a local value, a destructuring and a validate call's rules.
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

    public function check(): void
    {
        $this->validate(['size' => ['required', 'string'], 'count' => ['integer', 'min:1']]);
    }

    public function pick(): bool
    {
        return in_array('small', [
            'small',
            'large',
        ], true);
    }
}
