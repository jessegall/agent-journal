<?php

declare(strict_types=1);

namespace App\Attributes;

use Attribute;

/**
 * The write owner's consent on an event or a group of events: another domain's listener typed on it enforces an
 * invariant of the write, so it may run in the command's transaction.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TransactionListenerConsent {}
