<?php

declare(strict_types=1);

namespace Fixture\Tests;

use Fixture\Shape;
use Fixture\Widget;

final class WidgetShapeTest
{
    public function test_1(): void
    {
        $this->shape(new Widget());
    }

    private function shape(Shape $shape): Shape
    {
        return $shape;
    }
}
