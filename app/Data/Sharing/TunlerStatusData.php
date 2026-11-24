<?php

declare(strict_types=1);

namespace App\Data\Sharing;

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
        public readonly bool $loggedIn = false,
        #[MapInputName('auth_ok')]
        public readonly bool $isAuthenticated = false,
        public readonly string|null $host = null,
    ) {}
}
