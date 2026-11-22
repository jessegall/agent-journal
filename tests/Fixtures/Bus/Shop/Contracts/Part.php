<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Contracts;

/**
 * One part of a shop item, whatever class is behind it.
 */
interface Part
{
    public function label(): string;
}
