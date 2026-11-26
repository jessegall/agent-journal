<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What `tunler status --json` prints, the fields the journal reads; a field tunler leaves out reads as not logged in.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class TunlerStatusData extends Data
{
    public function __construct(
        #[MapInputName('logged_in')]
        public readonly bool $isLoggedIn = false,
        #[MapInputName('auth_ok')]
        public readonly bool $isAuthenticated = false,
        public readonly string|null $host = null,
    ) {}
}
