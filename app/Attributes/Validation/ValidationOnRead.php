<?php

declare(strict_types=1);

namespace App\Attributes\Validation;

use Attribute;

/**
 * A value whose validation attributes run where it is read, such as a host call's body the strict reader validates,
 * so a command may carry it with its rules already checked.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class ValidationOnRead {}
