<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use App\Sharing\Enums\ShareState;
use App\Sharing\Support\ShareListFilters;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The filters of the owner's list of shares as the page shows and sends them: a state, left out when none is chosen,
 * and a root type, a gateway configuration, an expiry date and the id the page starts after, each null when not set.
 */
#[TypeScript]
final class ShareFiltersData extends Data
{
    public function __construct(
        public readonly string|null $rootType,
        public readonly string|null $gateway,
        public readonly string|null $expiresBefore,
        public readonly string|null $after,
        public readonly ShareState|Optional $state = new Optional(),
    ) {}

    public function toFilters(): ShareListFilters
    {
        return new ShareListFilters(
            $this->state instanceof ShareState ? $this->state : null,
            $this->rootType,
            $this->gateway,
            $this->expiresBefore === null ? null : CarbonImmutable::parse($this->expiresBefore),
            $this->after,
        );
    }
}
