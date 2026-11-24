<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews;

use App\Concerns\HasIncomingWork;
use App\Concerns\HasStates;
use App\Contracts\Work\IncomingWorkProvider;
use App\Contracts\Records\StateProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Contracts\Settings\SettingsProvider;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Fixtures\Domains\Reviews\States\ReviewState;
use Tests\Fixtures\Domains\Reviews\Work\ReviewInbox;

final class ReviewsDomain extends Domain implements IncomingWorkProvider, SettingsProvider, StateProvider
{
    use HasIncomingWork;
    use HasStates;

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

    public function incomingWork(): array
    {
        return [ReviewInbox::class];
    }

    public function states(): array
    {
        return [ReviewState::class];
    }

    public function settings(): ReviewSettings
    {
        return new ReviewSettings();
    }
}
