<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Models\Profile;
use App\Profiles\Values\ProfileKey;
use App\Ui\Layout\DetailPage;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\SettingsGroup;
use App\Ui\Layout\SettingsRow;

/**
 * One profile as a read-only reader: its label, then its supplied facts in order: Program, Model, Models it may use,
 * Driver, How many run, and Rules it works under. A fact no read supplies is left out, and the rules, which nothing
 * reads for a profile yet, say they are not available instead of looking empty.
 */
final readonly class ProfileReaderLayout
{
    public function __construct(private ProfileResolver $profiles) {}

    public function part(ProfileKey $key): LayoutPartData
    {
        $profile = Profile::byKey($key);
        $page = DetailPage::make($profile->label)
            ->above(LayoutPartData::text('key', $profile->key, 'code'));

        if ($profile->isRetired()) {
            return $page->withStanding(LayoutPartData::notice('retired', 'info', 'This profile is retired.'))->part();
        }

        $snapshot = $this->profiles->snapshotFor($key);
        $models = $snapshot->start->allowedModels;

        $rows = [
            SettingsRow::value('program', 'Program', $snapshot->key->key),
            SettingsRow::value('model', 'Model', $snapshot->model),
            $models === []
                ? SettingsRow::value('models', 'Models it may use', 'Any model')->inBlock()
                : SettingsRow::chips('models', 'Models it may use', $models),
            ...($snapshot->start->driver === null
                ? []
                : [SettingsRow::value('driver', 'Driver', $snapshot->start->driver->value)]),
            SettingsRow::value('instances', 'How many run', str_replace('_', ' ', $snapshot->instances->value)),
            SettingsRow::value('rules', 'Rules it works under', 'Not available')->inBlock(),
        ];

        return $page->withStanding(SettingsGroup::make('profile', 'Profile')->withRows(...$rows)->part())->part();
    }
}
