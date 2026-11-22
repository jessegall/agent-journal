<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Enums\ActionMethod;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsPage;
use App\Support\Layout\SettingsRow;
use Spatie\LaravelData\Optional;
use Tests\TestCase;

/**
 * The shared settings recipe: groups in the order given, editable and read-only rows, block rows, and a Reset form
 * that carries the revision it was read at, with an Undo only where an inverse is declared.
 */
final class SettingsPageTest extends TestCase
{
    public function test_groups_keep_their_order_and_hold_editable_and_read_only_rows(): void
    {
        $root = SettingsPage::make(
            SettingsGroup::make('general', 'General', 'The basics')
                ->withRows(
                    SettingsRow::field('name', 'Journal name', new LayoutFieldData('name', 'Journal'))->changed(),
                    SettingsRow::field('on', 'Enabled', new LayoutFieldData('on', '1'), 'toggle'),
                    SettingsRow::value('version', 'Version', '6'),
                )
                ->savingTo(new LayoutFormData(ActionMethod::Post, '/settings/general', ['revision' => 4])),
            SettingsGroup::make('profile', 'Profile')->withRows(
                SettingsRow::chips('models', 'Models', ['fast', 'deep']),
                SettingsRow::code('script', 'Script', '/very/long/path/to/script.sh'),
            ),
        )->layout()->root;

        $this->assertSame(['general', 'profile'], $this->keysOf($root->children));

        $form = $root->children[0]->children[2]->children[0];

        $this->assertSame('form', $form->key);
        $this->assertSame(['row-name', 'row-on', 'row-version', 'save'], $this->keysOf($form->children));
        $this->assertSame('toggle', $form->children[1]->children[1]->style);
        $this->assertSame('changed', $form->children[0]->children[2]->key);

        $blocks = $root->children[1]->children[1]->children;

        $this->assertSame('setting-block', $blocks[0]->style);
        $this->assertSame('setting-block', $blocks[1]->style);
        $this->assertSame('chip', $blocks[0]->children[1]->children[0]->style);
        $this->assertSame('code', $blocks[1]->children[1]->style);
    }

    public function test_reset_is_there_only_when_the_declaration_permits_it_and_carries_its_revision_and_undo(): void
    {
        $plain = SettingsGroup::make('tasks', 'Tasks')->part();
        $undo = new LayoutFormData(ActionMethod::Post, '/settings/tasks/restore', ['revision' => 6]);
        $reset = new LayoutFormData(
            ActionMethod::Post,
            '/settings/tasks/reset',
            ['revision' => 5],
            confirmed: 'Tasks reset',
            undo: $undo,
        );

        $resettable = SettingsGroup::make('tasks', 'Tasks')->resettableBy($reset)->part();

        $this->assertSame(['title', 'rows'], $this->keysOf($plain->children));
        $this->assertSame(['title', 'reset', 'rows'], $this->keysOf($resettable->children));
        $this->assertSame(5, $resettable->children[1]->form->fixed['revision']);
        $this->assertSame(6, $resettable->children[1]->form->undo->fixed['revision']);
        $this->assertInstanceOf(Optional::class, $undo->undo);
    }

    /**
     * @param  list<LayoutPartData>  $parts
     * @return list<string>
     */
    private function keysOf(array $parts): array
    {
        return array_map(fn (LayoutPartData $part) => $part->key, $parts);
    }
}
