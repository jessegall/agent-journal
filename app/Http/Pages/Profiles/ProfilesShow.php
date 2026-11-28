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
 * One profile as a read-only reader: its label and description, then Type, Work it does, Preferred driver, Answers to
 * and How many run, then its Rules and Scripts. A fact no read supplies is left out, and the rules say they are not
 * available instead of looking empty.
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

        $page = DetailPage::build()->title($profile->label)->finish();

        if ($profile->description !== '') {
            $page = $page->summarising($profile->description);
        }

        if ($profile->isRetired()) {
            return $page->withStanding(LayoutPartData::build()
                ->asNotice()
                ->key('retired')
                ->style('info')
                ->title('This profile is retired.')
                ->finish())->part();
        }

        $snapshot = $this->profiles->snapshotFor($key);
        $tier = $snapshot->preferredTier;
        $script = ProfileRevision::findCurrentOf($profile)->script_source;

        $rows = [
            SettingsRow::build()
                ->key('type')
                ->label('Type')
                ->value($snapshot->base->label)
                ->help('The kind of agent it is.')
                ->finish(),
            SettingsRow::build()
                ->key('tier')
                ->label('Work it does')
                ->value($tier->label())
                ->help($tier->description().' '.self::TIER_HELP)
                ->finish(),
        ];

        if ($snapshot->start->preferredDriver !== null) {
            $rows[] = SettingsRow::build()
                ->key('driver')
                ->label('Preferred driver')
                ->value($snapshot->start->preferredDriver)
                ->help('The driver a start chooses first; you can still choose another.')
                ->finish();
        }

        array_push($rows, ...$this->answersTo($snapshot->supervisor));

        $rows[] = SettingsRow::build()
            ->key('instances')
            ->label('How many run')
            ->value(str_replace('_', ' ', $snapshot->instances->value))
            ->help('Whether one is reused or a new one starts for each job.')
            ->finish();

        $rules = $this->rulesOf($key);

        if (! $script->isEmpty()) {
            $rules[] = SettingsRow::build()->key('script')->label('Scripts')->code($script->text)->finish()->inBlock();
        }

        return $page->withStanding(
            SettingsGroup::build()->key('profile')->title('Profile')->finish()->withRows(...$rows)->part(),
            SettingsGroup::build()->key('rules')->title('Rules it works under')->finish()->withRows(...$rules)->part(),
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
            return [SettingsRow::build()
                ->key('answers-to')
                ->label('Answers to')
                ->value('You')
                ->help(self::ANSWERS_HELP)
                ->finish()];
        }

        if ($routes->default->isProfile()) {
            return [
                SettingsRow::build()
                    ->key('answers-to')
                    ->label('Answers to')
                    ->value($routes->default->profileKey()->key)
                    ->help(self::ANSWERS_HELP)
                    ->finish(),
            ];
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
            return [SettingsRow::build()
                ->key('rules')
                ->label('Rules it works under')
                ->value('Rules not available')
                ->finish()->inBlock()];
        }

        return array_map(fn (ProfileRuleGroup $group, int $place) => SettingsRow::build()
            ->key("rules-{$place}")
            ->label($group->label)
            ->control(
                $group->rules === []
                ? LayoutPartData::build()->asText()->key('none')->value('No rules')->style('muted')->finish()
                : LayoutPartData::build()
                    ->asCollection()
                    ->key('rules')
                    ->style('list')
                    ->rows(
                        array_map(
                            fn (ProfileRule $rule) => LayoutRowData::build()
                                ->key((string) $rule->number)
                                ->label($rule->text)
                                ->leading(
                                    [LayoutPartData::build()
                                    ->asText()
                                    ->key('number')
                                    ->value((string) $rule->number)
                                    ->style('muted')
                                    ->finish()],
                                )
                                ->finish(),
                            $group->rules,
                        ),
                    )
                    ->finish(),
            )
            ->isBlock(true)
            ->finish()->inBlock(), $groups->groups, array_keys($groups->groups));
    }
}
