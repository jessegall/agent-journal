<?php

declare(strict_types=1);

namespace App\Attributes\Web;

use Attribute;

/**
 * Marks a route action that changes what the app context holds, such as an account signed out, a driver approved, a
 * profile or a setting changed: the next page the browser receives sends the app context again.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
final readonly class RefreshesAppContext {}
