<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Support\Layout\DeclaredLayoutData;

/**
 * A reader's result that is shown as a declared layout: the layout itself, or a result that also carries
 * server-only facts, such as the record it shows, beside the layout it presents.
 */
interface PresentsLayout
{
    /**
     * The layout the page draws, as parts the frontend renders.
     */
    public function layout(): DeclaredLayoutData;
}
