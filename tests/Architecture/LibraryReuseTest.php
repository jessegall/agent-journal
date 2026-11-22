<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\LibraryReuse;

/**
 * Vue code outside the kit reuses the library's controls instead of drawing its own (user message 15814, doc 105).
 * Today's offenders are listed in a baseline that may only shrink: an offender outside it fails, and a listed one that
 * no longer offends fails until its line is removed.
 */
final class LibraryReuseTest extends TestCase
{
    private const string BASELINE = __DIR__.'/Support/library-reuse-baseline.txt';

    public function test_a_raw_button_and_an_own_menu_role_are_caught(): void
    {
        $root = dirname(__DIR__, 2);

        $found = LibraryReuse::in($root, [$root.'/tests/Fixtures/LibraryReuse']);

        $this->assertSame(
            ['tests/Fixtures/LibraryReuse/OwnMenu.vue:role=menu', 'tests/Fixtures/LibraryReuse/OwnMenu.vue:button'],
            array_values(array_unique($found)),
        );
    }

    public function test_no_vue_code_outside_the_kit_draws_a_control_the_library_has(): void
    {
        $baseline = self::baseline();
        $new = [];

        foreach ($this->offenders() as $place => $offender) {
            if (! in_array($offender, $baseline, true)) {
                $element = substr($place, strrpos($place, ':') + 1);
                $new[] = $place.' use '.LibraryReuse::componentFor($element);
            }
        }

        $this->assertSame([], $new, 'Use the library component named on each line instead.');
    }

    public function test_the_baseline_only_shrinks(): void
    {
        $offenders = array_values(array_unique($this->offenders()));

        $this->assertSame(
            [],
            array_values(array_diff(self::baseline(), $offenders)),
            'These no longer offend: remove their lines from the baseline.',
        );
    }

    /**
     * @return array<string, string>
     */
    private function offenders(): array
    {
        $root = dirname(__DIR__, 2);

        return LibraryReuse::in($root, [$root.'/resources/js', ...glob($root.'/domain/*/resources/js') ?: []]);
    }

    /**
     * @return list<string>
     */
    private static function baseline(): array
    {
        $lines = file(self::BASELINE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];

        return array_values(array_filter($lines, fn (string $line): bool => ! str_starts_with($line, '#')));
    }
}
