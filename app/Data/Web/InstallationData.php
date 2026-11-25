<?php

declare(strict_types=1);

namespace App\Data\Web;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The installation every page names: its display name, the version the sidebar shows (a release tag on main, else the
 * short commit hash), and what it could not heal by itself, shown to the owner alone.
 */
#[TypeScript]
final class InstallationData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $version,
        /** @var list<string> */
        public readonly array $faults,
    ) {}
}
