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

    public function test_a_name_used_by_the_owner_a_blank_name_or_an_empty_shape_is_refused_and_nothing_is_sent(): void
    {
        $this->journal->owner()->run(new SaveLayoutCommand('Review', LayoutShape::from(self::SHAPE)));
        $this->journal->sinkCommands();

        foreach ([
            [['name' => 'Review', 'shape' => self::SHAPE], ['name']],
            [['name' => '  ', 'shape' => self::SHAPE], ['name']],
            [['name' => 'Other', 'shape' => ['grid' => []]], ['shape.grid', 'shape.detached']],
        ] as [$payload, $fields]) {
            $this->journal->route('POST', 'layouts.store', payload: $payload)->assertSessionHasErrors($fields);
        }

        $this->journal->assertNothingDispatched();
    }

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
