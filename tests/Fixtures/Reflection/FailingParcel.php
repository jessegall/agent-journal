<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection;

use Tests\Fixtures\Reflection\Attributes\FailingMarker;

/**
 * A class whose marker cannot be built.
 */
#[FailingMarker]
final class FailingParcel {}
