<?php

declare(strict_types=1);

namespace App\Http\Pages\Profiles;

use App\Contracts\Sessions\ProfileResolver;
use App\Models\Profile;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsRow;
use App\Values\ProfileKey;

/**
 * One profile as a read-only reader: its label, then its supplied facts in order: Key, Model, Models it may use,
 * Driver, How many run, and Rules it works under. A fact no read supplies is left out, and the rules, which nothing
 * reads for a profile yet, say they are not available instead of looking empty.
 */
final readonly class ProfilesShow
{
    private const string MODELS_HELP = 'Others can be chosen when it starts.';

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
            SettingsRow::value('key', 'Key', $snapshot->key->key),
            SettingsRow::value('model', 'Model', $snapshot->model, 'The model it starts with.'),
            $models === []
                ? SettingsRow::value('models', 'Models it may use', 'Any model', self::MODELS_HELP)->inBlock()
                : SettingsRow::chips('models', 'Models it may use', $models, self::MODELS_HELP),
            ...($snapshot->start->driver === null
                ? []
                : [SettingsRow::value('driver', 'Driver', $snapshot->start->driver, 'How the journal runs it.')]),
            SettingsRow::value(
                'instances',
                'How many run',
                str_replace('_', ' ', $snapshot->instances->value),
                'Whether one is reused or a new one starts for each job.',
            ),
            SettingsRow::value('rules', 'Rules it works under', 'Not available')->inBlock(),
        ];

        return $page->withStanding(SettingsGroup::make('profile', 'Profile')->withRows(...$rows)->part())->part();
    }
}
