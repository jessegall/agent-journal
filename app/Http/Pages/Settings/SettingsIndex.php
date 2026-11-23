<?php

declare(strict_types=1);

namespace App\Http\Pages\Settings;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Settings\SettingsCatalogue;
use App\Data\SettingData;
use App\Data\SettingGroupData;
use App\Data\SettingsCatalogueData;
use App\Data\StringChoiceConstraintsData;
use App\Data\StringChoiceOptionData;
use App\Data\StringChoiceValueData;
use App\Data\ToggleGroupAvailabilityData;
use App\Enums\ActionMethod;
use App\Enums\GroupAvailability;
use App\Enums\SettingSource;
use App\Enums\SettingType;
use App\Exceptions\ServerOriginInvalid;
use App\Resolvers\ConnectProjectWindowResolver;
use App\Support\ConnectionsOwnerCheck;
use App\Support\CoreSettings;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsPage;
use App\Support\Layout\SettingsRow;
use App\Support\SettingRegistry;
use App\Support\SettingsValues;

/**
 * The settings of every owner on the shared settings recipe: one section for each declared group, in the order
 * Settings is read in (General, Connected projects, then each domain beside its own settings) and then in the order
 * the owners declared them. A group that can be switched off has its switch beside its heading; Connected projects
 * has the remote projects setting there. Text, on or off, whole-number and text-choice settings are saved as they are
 * changed; a changed setting says so, and Reset takes the changed ones of the group back to their defaults against the
 * revision the group was read at, so a group changed meanwhile is refused, never overwritten. Other kinds are shown
 * read-only.
 */
final readonly class SettingsIndex
{
    private const array ORDER = [
        'general', 'connected_projects', 'tasks', 'plans', 'documents', 'sequences', 'memory', 'reminders', 'helpers',
    ];

    private const string DOMAIN_SWITCH = 'domain_';

    public function __construct(
        private SettingsCatalogue $catalogue,
        private CurrentActor $actors,
        private ConnectionsOwnerCheck $connections,
        private CoreSettings $core,
        private ConnectProjectWindowResolver $connectWindow,
    ) {}

    public function layout(): DeclaredLayoutData
    {
        $sections = [];

        foreach ($this->catalogue->everyOwner() as $owner) {
            foreach ($owner->groups as $group) {
                $sections[] = [$this->rank($owner, $group), $this->sectionOf($owner, $group)];
            }
        }

        usort($sections, fn (array $first, array $second) => $first[0] <=> $second[0]);

        return SettingsPage::make(...array_map(fn (array $ranked) => $ranked[1], $sections))->layout();
    }

    /**
     * Where a group reads in the order: a Core group by its own key, a domain's switch by its domain's name and any
     * other group by its owner, so a domain's own settings follow its switch.
     */
    private function rank(SettingsCatalogueData $owner, SettingGroupData $group): int
    {
        $key = $group->identity->key;

        $subject = match (true) {
            $owner->owner !== SettingRegistry::CORE => strtolower($owner->owner),
            str_starts_with($key, self::DOMAIN_SWITCH) => substr($key, strlen(self::DOMAIN_SWITCH)),
            default => $key,
        };

        $position = array_search($subject, self::ORDER, true);

        return 2 * ($position === false ? count(self::ORDER) : $position) + ($this->isSwitched($group) ? 0 : 1);
    }

    private function sectionOf(SettingsCatalogueData $owner, SettingGroupData $group): SettingsGroup
    {
        $fixed = ['owner' => $owner->owner, 'group' => $group->identity->key, 'revision' => $owner->revision];

        $isConnections = $owner->owner === SettingRegistry::CORE
            && $group->identity->key === $this->core->connectedProjects->key;

        $rows = $isConnections ? $this->withoutSwitch($group->settings) : $group->settings;

        $section = SettingsGroup::make($group->identity->key, $group->label, $group->description)
            ->withRows(...$this->rowsOf($rows, $isConnections));

        $section = match (true) {
            $isConnections => $section->switchedBy(
                $this->saving($fixed),
                new LayoutFieldData($this->core->remoteProjects->key, $this->switchTextOf($group->settings)),
            ),
            $this->isSwitched($group) => $section->switchedBy(
                LayoutFormData::from([
                    'method' => ActionMethod::Post,
                    'href' => route('settings.switch', [], false),
                    'fixed' => $fixed,
                ]),
                new LayoutFieldData('enabled', $this->isOn($group) ? '1' : '0'),
            ),
            default => $section,
        };

        $section = array_any($rows, SettingsValues::isEditable(...))
            ? $section->savingTo($this->saving($fixed))
            : $section;

        return array_any($rows, fn (SettingData $setting) => $setting->source === SettingSource::Override)
            ? $section->resettableBy(LayoutFormData::from([
                'method' => ActionMethod::Post,
                'href' => route('settings.reset', [], false),
                'fixed' => $fixed,
                'confirmed' => "{$group->label} settings reset",
            ]))
            : $section;
    }

    /**
     * The Connected projects settings without the remote projects setting, which is drawn as the section's switch.
     *
     * @param  list<SettingData>  $settings
     * @return list<SettingData>
     */
    private function withoutSwitch(array $settings): array
    {
        $remoteProjects = $this->core->remoteProjects->key;

        return array_values(array_filter(
            $settings,
            fn (SettingData $setting) => $setting->identity->key !== $remoteProjects,
        ));
    }

    /**
     * A row for each setting, and for Connected projects the connect line and the connected projects after them.
     *
     * @param  list<SettingData>  $settings
     * @return list<SettingsRow>
     */
    private function rowsOf(array $settings, bool $isConnections): array
    {
        $rows = array_map(fn (SettingData $setting) => $this->rowOf($setting), $settings);

        if (! $isConnections) {
            return $rows;
        }

        return [...$rows, ...$this->connectionRows()];
    }

    /**
     * @param  array<string, string|int>  $fixed
     */
    private function saving(array $fixed): LayoutFormData
    {
        return LayoutFormData::from([
            'method' => ActionMethod::Post,
            'href' => route('settings.save', [], false),
            'fixed' => $fixed,
        ]);
    }

    /**
     * The connect line and the connected projects, for the owner, drawn in the section as the connection window shows
     * them; a journal whose own address is not set right says so in the row, and the rest of Settings still shows.
     *
     * @return list<SettingsRow>
     */
    private function connectionRows(): array
    {
        if (! $this->connections->allows($this->actors->actor())) {
            return [];
        }

        try {
            $connections = $this->connectWindow->read();
        } catch (ServerOriginInvalid $invalid) {
            return [SettingsRow::value('projects', 'Connect a project', $invalid->getMessage())->inBlock()];
        }

        $panel = LayoutPartData::native(
            'projects',
            LayoutNativeData::of('connections/ConnectedProjectsPart', $connections),
        );

        return [SettingsRow::reading('projects', 'Connect a project', $panel)];
    }

    /**
     * @param  list<SettingData>  $settings
     */
    private function switchTextOf(array $settings): string
    {
        foreach ($settings as $setting) {
            if ($setting->identity->key === $this->core->remoteProjects->key) {
                return SettingsValues::textOf($setting) ?? '0';
            }
        }

        return '0';
    }

    private function isSwitched(SettingGroupData $group): bool
    {
        return $group->availability instanceof ToggleGroupAvailabilityData;
    }

    private function isOn(SettingGroupData $group): bool
    {
        return $group->availability instanceof ToggleGroupAvailabilityData
            && $group->availability->state === GroupAvailability::Enabled;
    }

    private function rowOf(SettingData $setting): SettingsRow
    {
        $key = $setting->identity->key;
        $text = SettingsValues::textOf($setting);

        if ($text === null || ! SettingsValues::isEditable($setting)) {
            return SettingsRow::value($key, $setting->label, $text ?? 'Not shown', $setting->description)->inBlock();
        }

        $row = match (true) {
            $setting->default instanceof StringChoiceValueData => SettingsRow::field(
                $key,
                $setting->label,
                new LayoutFieldData($key, $text, [], $this->optionsOf($setting)),
                'choice',
                $setting->description,
            ),
            $setting->type === SettingType::Boolean => SettingsRow::field(
                $key,
                $setting->label,
                new LayoutFieldData($key, $text),
                'toggle',
                $setting->description,
            ),
            default => SettingsRow::field(
                $key,
                $setting->label,
                new LayoutFieldData($key, $text),
                'text',
                $setting->description,
            ),
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
