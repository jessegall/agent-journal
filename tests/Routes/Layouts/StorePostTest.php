<?php

declare(strict_types=1);

namespace Tests\Routes\Layouts;

use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Data\Layouts\LayoutShape;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner saves the screen's layout under a new name.
 */
#[TestsRoute('POST', 'layouts.store')]
final class StorePostTest extends GuardedRouteEntryTestCase
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
        $journal->owner();

        return RouteCall::as(Caller::User)
            ->payload([
                'name' => 'Writing',
                'shape' => self::SHAPE,
            ])
            ->expects(SaveLayoutCommand::class, [
                'name' => 'Writing',
                'shape' => LayoutShape::from(self::SHAPE),
            ]);
    }
}
