<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews;

use App\Domains\Concerns\HasIncomingWork;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\IncomingWorkProvider;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Settings\Contracts\SettingsProvider;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\Fixtures\Domains\Reviews\States\ReviewStateType;
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
        return [ReviewStateType::TYPE_KEY => ReviewStateType::class];
    }

    public function settings(): ReviewSettings
    {
        return new ReviewSettings();
    }
}
