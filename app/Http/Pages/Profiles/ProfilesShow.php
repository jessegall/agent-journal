<?php

declare(strict_types=1);

namespace App\Http\Pages\Profiles;

use App\Contracts\Sessions\ProfileResolver;
use App\Contracts\Sessions\ProfileRules;
use App\Models\Profile;
use App\Models\ProfileRevision;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsRow;
use App\Values\ProfileKey;
use App\Values\ProfileRule;
use App\Values\ProfileRuleGroup;
use App\Values\SupervisorRoutes;

/**
 * One profile as a read-only reader: its label and description, then its supplied facts in order: Type, Model,
 * Models it may use, Driver, Answers to and How many run, then a group of Rules it works under with its Scripts. A fact
 * no read supplies is left out, and the rules, which nothing reads for a profile yet, say they are not available
 * instead of looking empty.
 */
final readonly class ProfilesShow
{
    private const string MODELS_HELP = 'Others can be chosen when it starts.';

    private const string ANSWERS_HELP = 'Its supervisor, who gets its reports and questions.';

    public function __construct(private ProfileResolver $profiles, private ProfileRules $rules) {}

    public function part(ProfileKey $key): LayoutPartData
    {
        $profile = Profile::byKey($key);

        $page = DetailPage::make($profile->label);

        if ($profile->description !== '') {
            $page = $page->summarising($profile->description);
        }

        if ($profile->isRetired()) {
            return $page->withStanding(LayoutPartData::notice('retired', 'info', 'This profile is retired.'))->part();
        }

        $snapshot = $this->profiles->snapshotFor($key);
        $models = $snapshot->start->allowedModels;
        $script = ProfileRevision::currentOf($profile)->scriptSource();

        $rows = [
            SettingsRow::value('type', 'Type', $snapshot->base->label, 'The kind of agent it is.'),
            SettingsRow::value('model', 'Model', $snapshot->model, 'The model it starts with.'),
            $models === []
                ? SettingsRow::value('models', 'Models it may use', 'Any model', self::MODELS_HELP)->inBlock()
                : SettingsRow::chips('models', 'Models it may use', $models, self::MODELS_HELP),
        ];

        if ($snapshot->start->driver !== null) {
            $rows[] = SettingsRow::value('driver', 'Driver', $snapshot->start->driver, 'How the journal runs it.');
        }

        array_push($rows, ...$this->answersTo($snapshot->supervisor));

        $rows[] = SettingsRow::value(
            'instances',
            'How many run',
            str_replace('_', ' ', $snapshot->instances->value),
            'Whether one is reused or a new one starts for each job.',
        );

        $rules = $this->rulesOf($key);

        if (! $script->isEmpty()) {
            $rules[] = SettingsRow::code('script', 'Scripts', $script->text)->inBlock();
        }

        return $page->withStanding(
            SettingsGroup::make('profile', 'Profile')->withRows(...$rows)->part(),
            SettingsGroup::make('rules', 'Rules it works under')->withRows(...$rules)->part(),
        )->part();
    }

    /**
     * Who the profile's questions go to, when one target takes them all and it has a name a reader knows.
     *
     * @return list<SettingsRow>
     */
    private function answersTo(SupervisorRoutes $routes): array
    {
        if ($routes->overrides !== []) {
            return [];
        }

        if ($routes->default->isOwner()) {
            return [SettingsRow::value('answers-to', 'Answers to', 'You', self::ANSWERS_HELP)];
        }

        if ($routes->default->isProfile()) {
            return [SettingsRow::value('answers-to', 'Answers to', $routes->default->profileKey()->key, self::ANSWERS_HELP)];
        }

        return [];
    }

    /**
     * The rules it works under, a row for each group; rules that could not be read say so, and a group with none says
     * that instead.
     *
     * @return list<SettingsRow>
     */
    private function rulesOf(ProfileKey $key): array
    {
        $groups = $this->rules->of($key);

        if ($groups->isUnread()) {
            return [SettingsRow::value('rules', 'Rules it works under', 'Rules not available')->inBlock()];
        }

        return array_map(fn (ProfileRuleGroup $group, int $place) => SettingsRow::reading(
            "rules-{$place}",
            $group->label,
            $group->rules === []
                ? LayoutPartData::text('none', 'No rules', 'muted')
                : LayoutPartData::collection('rules', 'list', array_map(
                    fn (ProfileRule $rule) => LayoutRowData::from([
                        'key' => (string) $rule->number,
                        'label' => $rule->text,
                        'leading' => [LayoutPartData::text('number', (string) $rule->number, 'muted')],
                    ]),
                    $group->rules,
                )),
        )->inBlock(), $groups->groups, array_keys($groups->groups));
    }
}
