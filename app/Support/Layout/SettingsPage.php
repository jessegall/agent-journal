<?php

declare(strict_types=1);

namespace App\Support\Layout;

/**
 * The shared recipe of a settings page: its header, then its groups in the order the declaration gives them, in a column no wider than
 * the settings reader. A domain hands in neutral groups, rows and forms only.
 */
final readonly class SettingsPage
{
    /** @use \App\Web\Creation\Buildable<SettingsPageFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = SettingsPageFields::class;

    /**
     * @param  list<SettingsGroup>  $groups
     */
    public function __construct(private array $groups) {}

    public function layout(): DeclaredLayoutData
    {
        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('settings')
                ->style('page')
                ->children(
                    LayoutPartData::build()
                    ->asBox()
                    ->key('header')
                    ->style('page-head')
                    ->children(
                        LayoutPartData::build()
                        ->asText()
                        ->key('title')
                        ->value('Settings')
                        ->style('heading')
                        ->finish(),
                    )
                    ->finish(),
                    LayoutPartData::build()
                    ->asBox()
                    ->key('settings-page')
                    ->style('settings-page')
                    ->children(...array_map(fn (SettingsGroup $group) => $group->part(), $this->groups))
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
    }
}
