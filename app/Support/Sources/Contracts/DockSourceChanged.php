<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

/**
 * A committed fact an owner raises when a dockable source changed, so the pages that dock it read its card again. It
 * names the source only; the fresh read decides what each viewer sees, and a source docked nowhere changes no page.
 */
interface DockSourceChanged extends DockSourceFact {}
