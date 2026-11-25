<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Contracts\Events\Event;
use App\Support\Exports as ExportList;
use App\Support\ExportValidator;
use App\Support\Reflector;
use Tests\Fixtures\ExportedEvents\Api\Events\DraftSaved;
use Tests\Fixtures\ExportedEvents\Support\ReportPrepared;
use Tests\TestCase;

/**
 * An event is public because its owner exports it, wherever it sits: an exported event outside any Events folder is
 * published, and an event in Api/Events that is not exported stays private. Both carry the Event marker.
 */
final class EventPlacementTest extends TestCase
{
    public function test_the_exports_list_and_not_the_folder_decides_which_event_is_public(): void
    {
        $checked = ExportValidator::check(
            'Fixture',
            'Tests\\Fixtures\\ExportedEvents',
            ExportList::make()->events(ReportPrepared::class)->build(),
        );

        $this->assertSame([ReportPrepared::class], $checked->events);
        $this->assertNotContains(DraftSaved::class, $checked->events);
        $this->assertTrue(Reflector::of(ReportPrepared::class)->is(Event::class));
        $this->assertTrue(Reflector::of(DraftSaved::class)->is(Event::class));
    }
}
