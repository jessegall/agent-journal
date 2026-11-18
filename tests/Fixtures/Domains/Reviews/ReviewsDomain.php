<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Settings\Contracts\ProvidesSettings;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;

final class ReviewsDomain extends Domain implements ProvidesSettings
{
    public function description(): string
    {
        return 'A fixture domain that declares a setting of every type.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function settings(): ReviewSettings
    {
        return new ReviewSettings;
    }
}
