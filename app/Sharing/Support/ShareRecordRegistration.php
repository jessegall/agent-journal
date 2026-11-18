<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Contracts\Shareable;
use App\Sharing\Contracts\ShareRecordProvider;

/**
 * One shareable record type a domain registers: its link alias, its model, the provider that reads it and the
 * capabilities it advertises to relations that reach it.
 */
final readonly class ShareRecordRegistration
{
    /**
     * @param  class-string<Shareable>  $modelClass
     * @param  class-string<ShareRecordProvider>  $providerClass
     * @param  list<string>  $capabilities
     */
    public function __construct(
        public string $alias,
        public string $modelClass,
        public string $providerClass,
        public array $capabilities,
    ) {}
}
