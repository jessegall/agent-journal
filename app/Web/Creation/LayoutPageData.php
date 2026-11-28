<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Navigation\Contracts\PresentsLayout;
use App\Support\Layout\DeclaredLayoutData;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;

abstract class LayoutPageData extends Data implements PresentsLayout
{
    /** Holds the checked tree before its browser projection. */
    public function __construct(#[Hidden] public readonly DeclaredLayoutData $shown) {}

    /** Returns the checked tree sent to the browser. */
    final public function layout(): DeclaredLayoutData
    {
        return $this->shown;
    }
}
