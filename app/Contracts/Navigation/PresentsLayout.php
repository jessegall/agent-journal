<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Support\Layout\DeclaredLayoutData;

/**
 * A reader's result that is shown as a declared layout: the layout itself, or a result that also carries
 * server-only facts, such as where it docks from, beside the layout it presents.
 */
interface PresentsLayout
{
    /**
     * The layout the page draws, as parts the frontend renders.
     */
    public function layout(): DeclaredLayoutData;
}
