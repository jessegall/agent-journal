<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Library;

use App\Settings\Contracts\SettingsProvider;
use App\Support\Domain;
use App\Support\Exports;

final class LibraryDomain extends Domain implements SettingsProvider
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
