<?php

declare(strict_types=1);

namespace App\Support\StateLoading;

/**
 * A state to build: its type and the values its frame saved or its push gives, as stored.
 */
final readonly class SavedState
{
    /**
     * @param  array<string, mixed>  $values
     */
    public function __construct(public RegisteredStateType $type, public array $values) {}
}
