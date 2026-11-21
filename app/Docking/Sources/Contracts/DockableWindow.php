<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Docking\Cards\DockIdentity;

/**
 * The data of a window that shows one source: the journal offers to dock that source wherever the window is shown.
 */
interface DockableWindow
{
    public function dockSource(): DockIdentity;
}
