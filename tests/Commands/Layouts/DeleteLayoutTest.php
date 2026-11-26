<?php

declare(strict_types=1);

namespace Tests\Commands\Layouts;

use App\Models\Access\User;
use App\Models\Records\Layout;
use App\Terminals\Commands\DeleteLayout\DeleteLayoutCommand;
use App\Terminals\Data\LayoutShape;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user deletes one of their own layouts; another user's layout is not there for them and stays.
 */
#[TestsCommand(DeleteLayoutCommand::class)]
final class DeleteLayoutTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_deleted_layout_is_gone_and_another_users_stays(): void
    {
        $this->journal->owner();
        $ownLayout = Layout::create(
            $this->journal->ownerUser()->id,
            'Writing',
            LayoutShape::from(SaveLayoutTest::shape('chat')),
        );
        $strangersLayout = Layout::create(
            $this->journal->createUser('Stranger')->id,
            'Theirs',
            LayoutShape::from(SaveLayoutTest::shape('chat')),
        );

        $this->journal->run(new DeleteLayoutCommand($ownLayout->id));

        $this->assertThrows(
            fn () => $this->journal->run(new DeleteLayoutCommand($strangersLayout->id)),
            ModelNotFoundException::class,
        );
        $this->assertSame([$strangersLayout->id], Layout::query()->withoutGlobalScopes()->pluck('id')->all());
    }
}
