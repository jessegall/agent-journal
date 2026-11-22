<?php

declare(strict_types=1);

namespace App\Support\Relay;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The one field of a raw hook payload read without trusting the rest: the native event it names.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class NamedHookEvent extends Data
{
    public function __construct(public readonly string $hookEventName = 'unknown') {}
}
