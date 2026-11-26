<?php

declare(strict_types=1);

namespace App\Http\Pages\Profiles;

use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Sessions\Contracts\ProfileResolver;
use App\Sessions\Contracts\ProfileRules;
use App\Sessions\Values\ProfileRule;
use App\Sessions\Values\ProfileRuleGroup;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsRow;
use App\Values\ProfileKey;
use App\Values\SupervisorRoutes;

/**
 * One profile as a read-only reader: its label and description, then its supplied facts in order: Type, Work it does
 * (its tier), Preferred driver, Answers to and How many run, then a group of Rules it works under with its Scripts. A fact
 * no read supplies is left out, and the rules, which nothing reads for a profile yet, say they are not available
 * instead of looking empty.
 */
final readonly class ProfilesShow extends ProfilesPage
{
    /**
     * What the tier decides, after what the tier is for.
     */
    private const string TIER_HELP = 'A start runs the model of this tier, and any other model can be chosen.';

    private const string ANSWERS_HELP = 'Its supervisor, who gets its reports and questions.';

    public function __construct(private ProfileResolver $profiles, private ProfileRules $rules) {}

    public function part(ProfileKey $key): LayoutPartData
    {
        $profile = Profile::findByKey($key);

        $page = DetailPage::make($profile->label);

        if ($profile->description !== '') {
            $page = $page->summarising($profile->description);
        }

        if ($profile->isRetired()) {
            return $page->withStanding(LayoutPartData::notice('retired', 'info', 'This profile is retired.'))->part();
        }

        $snapshot = $this->profiles->snapshotFor($key);
        $tier = $snapshot->preferredTier;
        $script = ProfileRevision::findCurrentOf($profile)->script_source;

        $rows = [
            SettingsRow::value('type', 'Type', $snapshot->base->label, 'The kind of agent it is.'),
            SettingsRow::value('tier', 'Work it does', $tier->label(), $tier->description().' '.self::TIER_HELP),
        ];

        if ($snapshot->start->preferredDriver !== null) {
            $rows[] = SettingsRow::value(
                'driver',
                'Preferred driver',
                $snapshot->start->preferredDriver,
                'The driver a start chooses first; you can still choose another.',
            );
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
