<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

/**
 * A committed fact an owner raises once a dockable source is deleted for good, so every placement of it goes. A
 * source that is only unreadable, or whose owner is not installed, is not deleted and raises nothing.
 */
interface DockSourceDeleted extends DockSourceFact {}
