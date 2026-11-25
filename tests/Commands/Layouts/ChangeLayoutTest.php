<?php

declare(strict_types=1);

namespace Tests\Commands\Layouts;

use App\Commands\Layouts\ChangeLayout\ChangeLayoutCommand;
use App\Data\Layouts\LayoutShape;
use App\Models\Access\User;
use App\Models\Records\Layout;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;
use Tests\TestCase;

/**
 * A user renames and reshapes a layout of theirs; another user's layout is not there for them and stays as it was.
 */
final class ChangeLayoutTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    public function test_a_layout_takes_its_new_name_and_shape(): void
    {
        $this->journal()->owner();
        $layout = Layout::create($this->journal()->ownerUser()->id, 'Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));

        $this->journal()->run(new ChangeLayoutCommand($layout->id, 'Reading', LayoutShape::from(SaveLayoutTest::shape('tasks'))));

        $this->assertSame(['Reading', ['tasks']], [$layout->refresh()->name, $layout->shape->grid->windows]);
    }

    public function test_another_users_layout_is_not_there_and_stays_as_it_was(): void
    {
        $this->journal()->owner();
        $strangersLayout = Layout::create(User::factory()->create()->id, 'Theirs', LayoutShape::from(SaveLayoutTest::shape('chat')));

        $this->assertThrows(
            fn () => $this->journal()->run(new ChangeLayoutCommand($strangersLayout->id, 'Mine', LayoutShape::from(SaveLayoutTest::shape('tasks')))),
            ModelNotFoundException::class,
        );
        $this->assertSame('Theirs', Layout::query()->withoutGlobalScopes()->findOrFail($strangersLayout->id)->name);
    }
}
