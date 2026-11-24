<?php

declare(strict_types=1);

namespace Fixture\Tests;

use Fixture\Shape;
use Fixture\ShapeDrawer;

final class ShapeDrawerTest
{
    public function test_1(): void
    {
        new ShapeDrawer()->draw(new class implements Shape {});
    }
}
