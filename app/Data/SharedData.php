<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What every page receives beside its own page object: the application name and, once signed in, the user,
 * whether they may share records and the stable code of the refusal the last form was answered with.
 */
#[TypeScript]
final class SharedData extends Data
{
    public function __construct(
        public readonly string $name,
        // The version the sidebar shows: a release tag on main, else the short commit hash.
        public readonly string $version,
        public readonly CurrentUserData|Optional $currentUser = new Optional(),
        public readonly bool|Optional $canShare = new Optional(),
        public readonly string|Optional $refusalCode = new Optional(),
    ) {}
}
