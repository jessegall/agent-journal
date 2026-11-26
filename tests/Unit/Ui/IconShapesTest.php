<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Navigation\Enums\Icon;
use PHPUnit\Framework\TestCase;

/**
 * Every icon a page or navigation item may name has a shape the browser's Icon component draws.
 */
final class IconShapesTest extends TestCase
{
    public function test_every_icon_case_has_a_drawn_shape(): void
    {
        $component = (string) file_get_contents(__DIR__.'/../../../resources/js/components/kit/Icon.vue');
        preg_match_all("/^\s{4}'?([a-z-]+)'?:/m", $component, $shapes);

        $this->assertSame([], array_values(array_diff(
            array_map(fn (Icon $icon) => $icon->value, Icon::cases()),
            $shapes[1],
        )));

        $this->assertContains('accounts', $shapes[1]);
    }
}
