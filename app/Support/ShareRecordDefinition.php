<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Shareable;
use App\Contracts\ShareRecordProvider;

/**
 * One shareable record type a domain registers: its link alias, its model, the provider that reads it and the
 * capabilities it advertises to relations that reach it.
 */
final readonly class ShareRecordDefinition
{
    /**
     * @param  string  $modelClass  a class name, refused unless it is a Shareable model
     * @param  string  $providerClass  a class name, refused unless it is a ShareRecordProvider
     * @param  list<string>  $capabilities
     */
    public function __construct(
        public string $alias,
        public string $modelClass,
        public string $providerClass,
        public array $capabilities,
    ) {}

    /**
     * @param  list<string>  $capabilities
     */
    public function advertisesAnyOf(array $capabilities): bool
    {
        return array_intersect($this->capabilities, $capabilities) !== [];
    }
}
