<?php

declare(strict_types=1);

namespace App\Attributes;

use Attribute;

/**
 * Runs a command in a repeatable-read transaction, retried as a whole when the database asks for it.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class RepeatableRead {}
