<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\Layout\DeclaredLayoutData;

/**
 * A reader's result that is shown as a declared layout: the layout itself, or a result that also carries
 * server-only facts, such as where it docks from, beside the layout it presents.
 */
interface PresentsLayout
{
    public function layout(): DeclaredLayoutData;
}
