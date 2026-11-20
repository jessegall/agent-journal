<?php

declare(strict_types=1);

namespace App\Hooks\Attributes;

use Attribute;

/**
 * Selects a state handler even when a higher frame handles the same input.
 */
#[Attribute(Attribute::TARGET_METHOD)]
final class StackWide {}
