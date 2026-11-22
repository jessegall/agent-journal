<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

use App\Support\Cards\DockIdentity;
use PhpOption\Option;

/**
 * The data of a window that may show one source: the journal offers to dock that source wherever the window is shown,
 * and offers nothing when the window docks none.
 */
interface DockableWindow
{
    /**
     * @return Option<DockIdentity>
     */
    public function dockSource(): Option;
}
