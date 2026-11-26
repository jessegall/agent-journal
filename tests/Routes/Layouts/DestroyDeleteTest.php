<?php

declare(strict_types=1);

namespace Tests\Routes\Layouts;

use App\Models\Records\Layout;
use App\Terminals\Commands\DeleteLayout\DeleteLayoutCommand;
use App\Terminals\Data\LayoutShape;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner deletes one of their saved layouts.
 */
#[TestsRoute('DELETE', 'layouts.destroy')]
final class DestroyDeleteTest extends GuardedRouteEntryTestCase
{
    /**
     * The shape the browser sends: one pane holding the chat window, and nothing detached.
     */
    private const array SHAPE = [
        'grid' => [
            'type' => 'pane',
            'id' => 'pane-chat',
            'windows' => [
                'chat',
            ],
            'active' => 'chat',
            'isWidthLimited' => false,
        ],
        'detached' => [],
    ];

    protected function arrange(TestJournal $journal): RouteCall
    {
        $layout = Layout::create($journal->owner()->ownerUser()->id, 'Writing', LayoutShape::from(self::SHAPE));

        return RouteCall::as(Caller::User)
            ->parameters([
                'layout' => $layout->id,
            ])
            ->expects(DeleteLayoutCommand::class, [
                'layoutId' => $layout->id,
            ]);
    }
}
