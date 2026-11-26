<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The public address of one share, answered only to the owner's deliberate reveal.
 */
#[TypeScript]
final class ShareLinkData extends Data
{
    public function __construct(public readonly string $url) {}
}
