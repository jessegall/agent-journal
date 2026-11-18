<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Library;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Settings\Contracts\ProvidesSettings;

final class LibraryDomain extends Domain implements ProvidesSettings
{
    public function description(): string
    {
        return 'A fixture domain that declares settings.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function settings(): LibrarySettings
    {
        return new LibrarySettings();
    }
}
