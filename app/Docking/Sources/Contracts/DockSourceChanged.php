<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A committed fact an owner raises when a dockable source changed, so the conversations that dock it read its card
 * again. It names the source only; the fresh read decides what each viewer sees.
 */
interface DockSourceChanged extends UserInterfaceUpdater
{
    public function dockType(): string;

    public function dockId(): string;
}
