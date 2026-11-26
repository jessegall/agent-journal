<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Attributes\Listeners\TransactionListenerConsent;

/**
 * A fact an owner raises when a record is deleted for good; whatever keeps a reference to it removes that reference in
 * the deletion's own transaction, so a rolled-back deletion keeps it. A record that is only unreadable, or whose owner
 * is not installed, is not deleted and raises nothing.
 */
#[TransactionListenerConsent]
interface RecordDeleted extends RecordFact {}
