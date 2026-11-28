<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Settings\Enums\ActionMethod;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsRow;
use Spatie\LaravelData\Optional;
use Tests\TestCase;

/**
 * The shared settings recipe: a header, then groups in the order given, editable rows that send themselves and
 * read-only rows, block rows, a switch beside a heading, and a Reset form that carries the revision it was read at,
 * with an Undo only where an inverse is declared.
 */
final class SettingsPageTest extends TestCase
{
    public function test_a_row_recipe_uses_the_finished_key_and_label_for_its_field(): void
    {
        $row = SettingsRow::build()
            ->field(LayoutFieldData::build()->name('title')->finish())
            ->key('title')
            ->label('Title')
            ->finish()
            ->part();

        $this->assertSame('row-title', $row->key);
        $this->assertSame('title', $row->children[1]->key);
        $this->assertSame('Title', $row->children[1]->text);
    }

    public function test_groups_keep_their_order_and_hold_editable_and_read_only_rows(): void
    {
        $root = SettingsGroup::page(
            SettingsGroup::build()->key('general')->title('General')->help('The basics')->finish()
            ->withRows(
                SettingsRow::build()
                    ->key('name')
                    ->label('Journal name')
                    ->field(
                        LayoutFieldData::build()
                        ->name('name')
                        ->value('Journal')
                        ->finish(),
                    )
                    ->finish()->changed(),
                SettingsRow::build()
                    ->key('on')
                    ->label('Enabled')
                    ->field(
                        LayoutFieldData::build()
                        ->name('on')
                        ->value('1')
                        ->finish(),
                        'toggle',
                    )
                    ->finish(),
                SettingsRow::build()->key('version')->label('Version')->value('6')->finish(),
            )
            ->savingTo(LayoutFormData::build()
                ->method(ActionMethod::Post)
                ->href('/settings/general')
                ->fixed(['revision' => 4])
                ->finish()),
            SettingsGroup::build()->key('profile')->title('Profile')->finish()->withRows(
                SettingsRow::build()->key('models')->label('Models')->chips(['fast', 'deep'])->finish(),
                SettingsRow::build()
                    ->key('script')
                    ->label('Script')
                    ->code('/very/long/path/to/script.sh')
                    ->finish(),
            ),
        )->root;

        $this->assertSame(['header', 'settings-page'], $this->keysOf($root->children));

        $groups = $root->children[1]->children;

        $this->assertSame(['general', 'profile'], $this->keysOf($groups));

        $form = $groups[0]->children[2]->children[0];

        $this->assertSame('form', $form->key);
        $this->assertSame('live', $form->style);
        $this->assertSame(['row-name', 'row-on', 'row-version'], $this->keysOf($form->children));
        $this->assertSame('toggle', $form->children[1]->children[1]->style);
        $this->assertSame('changed', $form->children[0]->children[2]->key);

        $blocks = $groups[1]->children[1]->children;

        $this->assertSame('setting-block', $blocks[0]->style);
        $this->assertSame('setting-block', $blocks[1]->style);
        $this->assertSame('chip', $blocks[0]->children[1]->children[0]->style);
        $this->assertSame('code', $blocks[1]->children[1]->style);
    }

    public function test_reset_is_there_only_when_the_declaration_permits_it_and_carries_its_revision_and_undo(): void
    {
        $plain = SettingsGroup::build()->key('tasks')->title('Tasks')->finish()->part();
        $undo = LayoutFormData::build()
            ->method(ActionMethod::Post)
            ->href('/settings/tasks/restore')
            ->fixed(['revision' => 6])
            ->finish();

        $reset = LayoutFormData::build()
            ->method(ActionMethod::Post)
            ->href('/settings/tasks/reset')
            ->fixed(['revision' => 5])
            ->confirmed('Tasks reset')
            ->undo($undo)
            ->finish();

        $resettable = SettingsGroup::build()->key('tasks')->title('Tasks')->finish()->resettableBy($reset)->part();

        $this->assertSame(['title'], $this->keysOf($plain->children));
        $this->assertSame(['title', 'reset'], $this->keysOf($resettable->children));
        $this->assertSame(5, $resettable->children[1]->form->fixed['revision']);
        $this->assertSame(6, $resettable->children[1]->form->undo->fixed['revision']);
        $this->assertInstanceOf(Optional::class, $undo->undo);
    }

    public function test_a_switched_group_draws_its_switch_beside_its_heading_as_a_form_that_sends_itself(): void
    {
        $switch = LayoutFormData::build()
            ->method(ActionMethod::Post)
            ->href('/settings/switch')
            ->fixed(['group' => 'domain_tasks'])
            ->finish();

        $group = SettingsGroup::build()
            ->key('domain_tasks')
            ->title('Tasks')
            ->help('When off, its pages are hidden.')
            ->finish()
            ->switchedBy($switch, LayoutFieldData::build()->name('enabled')->value('1')->finish())
            ->part();

        $this->assertSame(['title', 'help', 'switch'], $this->keysOf($group->children));
        $this->assertSame('live', $group->children[2]->style);
        $this->assertSame('toggle', $group->children[2]->children[0]->style);
        $this->assertSame('domain_tasks', $group->children[2]->form->fixed['group']);
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
