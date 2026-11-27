<?php

declare(strict_types=1);

namespace App\Attributes\Validation;

use Attribute;
use Spatie\LaravelData\Attributes\Validation\Sometimes;
use Spatie\LaravelData\Support\Validation\RequiringRule;

/**
 * A field a call may leave out, and may send empty: checked only when sent, in place of the required rule Laravel
 * Data infers for a field with a default.
 */
#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_PARAMETER)]
final class OptionalField extends Sometimes implements RequiringRule {}
