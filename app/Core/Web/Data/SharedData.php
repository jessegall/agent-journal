<?php

declare(strict_types=1);

namespace App\Core\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What every page receives beside its own page object: the application name and, once signed in, the user.
 */
#[TypeScript]
final class SharedData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly CurrentUserData|Optional $currentUser = new Optional,
    ) {}
}
