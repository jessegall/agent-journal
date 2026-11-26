<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

use App\Attributes\Listeners\TransactionListenerConsent;
use App\Processes\Sources\Contracts\DockSourceFact;

/**
 * A fact an owner raises when a dockable source is deleted for good; every placement of it is removed in the
 * deletion's own transaction, so a rolled-back deletion keeps them. A source that is only unreadable, or whose owner
 * is not installed, is not deleted and raises nothing.
 */
#[TransactionListenerConsent]
interface DockSourceDeleted extends DockSourceFact {}
