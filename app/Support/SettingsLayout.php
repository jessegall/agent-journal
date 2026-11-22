<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CurrentActor;
use App\Contracts\SettingsCatalogue;
use App\Data\SettingData;
use App\Data\SettingsCatalogueData;
use App\Data\StringChoiceConstraintsData;
use App\Data\StringChoiceOptionData;
use App\Data\StringChoiceValueData;
use App\Enums\ActionMethod;
use App\Enums\SettingSource;
use App\Enums\SettingType;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsPage;
use App\Support\Layout\SettingsRow;

/**
 * The settings of every owner on the shared settings recipe: one group for each owner, in the order Settings is read in
 * (General, Connected projects, Tasks, Plans, Documents, Sequences, Memory, Reminders, Helpers) and then in the order
 * the owners were declared. Text, on or off, whole-number and text-choice settings are edited and saved together; a
 * changed setting says so, and Reset takes the changed ones of the group back to their defaults against the revision
 * the group was read at, so a group changed meanwhile is refused, never overwritten. Other kinds are shown read-only.
 */
final readonly class SettingsLayout
{
    private const array ORDER = [
        'general', 'connections', 'tasks', 'plans', 'documents', 'sequences', 'memory', 'reminders', 'helpers',
    ];

    public function __construct(
        private SettingsCatalogue $catalogue,
        private CurrentActor $actors,
        private ConnectionsOwnerCheck $connections,
    ) {}

    public function layout(): DeclaredLayoutData
    {
        $groups = array_map(
            fn (SettingsCatalogueData $catalogue) => [$this->rank($catalogue->owner), $this->groupOf($catalogue)],
            $this->catalogue->everyOwner(),
        );

        if ($this->connections->allows($this->actors->actor())) {
            $groups[] = [$this->rank('connections'), $this->connectedProjects()];
        }

        usort($groups, fn (array $first, array $second) => $first[0] <=> $second[0]);

        return SettingsPage::make(...array_map(fn (array $ranked) => $ranked[1], $groups))->layout();
    }

    /**
     * The Connected projects group: what it is for and, for the owner, the way into the connection window, which
     * leads back here to this group.
     */
    private function connectedProjects(): SettingsGroup
    {
        $opener = LayoutPartData::action(
            'open',
            'Open connected projects',
            LayoutActionData::to(route('connections.connect', ['return' => '/settings#connected-projects'], false)),
            'bordered',
        );

        return SettingsGroup::make('connected-projects', 'Connected projects')->withRows(
            SettingsRow::value(
                'about',
                'Projects on other machines',
                'Connect a project, copy its install line, see which projects are connected and revoke one.',
            ),
            SettingsRow::reading('open', 'Connection window', $opener),
        );
    }

    private function rank(string $owner): int
    {
        $position = array_search($owner, self::ORDER, true);

        return $position === false ? count(self::ORDER) : $position;
    }

    private function groupOf(SettingsCatalogueData $owner): SettingsGroup
    {
        $settings = array_merge(...array_map(fn ($group) => $group->settings, $owner->groups));
        $fixed = ['owner' => $owner->owner, 'revision' => $owner->revision];
        $hasEditable = array_any($settings, SettingsValues::isEditable(...));
        $hasChange = array_any($settings, fn (SettingData $setting) => $setting->source === SettingSource::Override);

        $group = SettingsGroup::make($owner->owner, ucfirst($owner->owner))->withRows(
            ...array_map(fn (SettingData $setting) => $this->rowOf($setting), $settings),
        );

        $group = $hasEditable
            ? $group->savingTo(new LayoutFormData(ActionMethod::Post, route('settings.save', [], false), $fixed))
            : $group;

        return $hasChange
            ? $group->resettableBy(new LayoutFormData(
                ActionMethod::Post,
                route('settings.reset', [], false),
                $fixed,
                confirmed: ucfirst($owner->owner).' settings were reset',
            ))
            : $group;
    }

    private function rowOf(SettingData $setting): SettingsRow
    {
        $key = $setting->identity->key;
        $text = SettingsValues::textOf($setting);

        if ($text === null || ! SettingsValues::isEditable($setting)) {
            return SettingsRow::value($key, $setting->label, $text ?? 'Not shown')->inBlock();
        }

        $row = match (true) {
            $setting->default instanceof StringChoiceValueData => SettingsRow::field(
                $key,
                $setting->label,
                new LayoutFieldData($key, $text, [], $this->optionsOf($setting)),
                'choice',
            ),
            $setting->type === SettingType::Boolean => SettingsRow::field(
                $key,
                $setting->label,
                new LayoutFieldData($key, $text),
                'toggle',
            ),
            default => SettingsRow::field($key, $setting->label, new LayoutFieldData($key, $text), 'text'),
        };

        return $setting->source === SettingSource::Override ? $row->changed() : $row;
    }

    /**
     * @return list<string>
     */
    private function optionsOf(SettingData $setting): array
    {
        $constraints = $setting->constraints;

        return $constraints instanceof StringChoiceConstraintsData
            ? array_map(fn (StringChoiceOptionData $option) => $option->optionKey, $constraints->options)
            : [];
    }
}
