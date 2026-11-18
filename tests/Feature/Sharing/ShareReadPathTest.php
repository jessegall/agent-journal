<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Domains\Support\Domain;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Exceptions\ShareReadRefused;
use App\Sharing\Exceptions\UnknownShareRelation;
use App\Sharing\Support\ShareCursor;
use App\Sharing\Support\ShareCursors;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareReadPath;
use App\Sharing\Support\ShareRecordRegistry;
use Tests\Fixtures\Domains\Pamphlets\PamphletsDomain;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Public read paths follow only declared relations, at most four steps and never in a circle, by record ULID; page
 * cursors are signed and refused for another share, scope version or path.
 */
final class ShareReadPathTest extends TestCase
{
    private RecordIdentity $root;

    private ShareRecordRegistry $records;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(new PamphletsDomain());
        $this->records = $this->app->make(ShareRecordRegistry::class);
        $this->records->checkRelations();
        $this->root = new RecordIdentity('pamphlets.pamphlet', TestIds::of(1));
    }

    public function test_a_declared_step_leads_to_its_record(): void
    {
        $path = ShareReadPath::parse('notes/pamphlets.note/'.TestIds::of(2), $this->root, $this->records);

        $this->assertEquals(new RecordIdentity('pamphlets.note', TestIds::of(2)), $path->target($this->root));
        $this->assertEquals($this->root, ShareReadPath::parse('', $this->root, $this->records)->target($this->root));
    }

    public function test_five_steps_a_circle_an_undeclared_relation_and_a_number_are_refused(): void
    {
        $five = implode('/', array_map(fn (int $number) => 'notes/pamphlets.note/'.TestIds::of($number), range(2, 6)));

        $this->assertThrows(fn () => ShareReadPath::parse($five, $this->root, $this->records), ShareReadRefused::class, 'at most 4 steps');
        $this->assertThrows(fn () => ShareReadPath::parse('notes/pamphlets.pamphlet/'.TestIds::of(1), $this->root, $this->records), ShareReadRefused::class, 'circle');
        $this->assertThrows(fn () => ShareReadPath::parse('records/pamphlets.note/'.TestIds::of(2), $this->root, $this->records), UnknownShareRelation::class);
        $this->assertThrows(fn () => ShareReadPath::parse('notes/pamphlets.note/12', $this->root, $this->records), ShareReadRefused::class, 'not part of the share');
        $this->assertThrows(fn () => ShareReadPath::parse('notes/pamphlets.note', $this->root, $this->records), ShareReadRefused::class, 'not part of the share');
    }

    public function test_a_cursor_reads_back_for_its_place_and_is_refused_after_a_scope_refresh_or_tampering(): void
    {
        $cursors = $this->app->make(ShareCursors::class);
        $place = new ShareCursor(TestIds::of(9), 1, '', 'notes', ShareCursor::ORDER_WRITTEN_THEN_ID, '');
        $text = $cursors->write(new ShareCursor(TestIds::of(9), 1, '', 'notes', ShareCursor::ORDER_WRITTEN_THEN_ID, 'after-50'));

        $this->assertSame('after-50', $cursors->read($text, $place)->continuation);
        $this->assertThrows(fn () => $cursors->read($text, new ShareCursor(TestIds::of(9), 2, '', 'notes', ShareCursor::ORDER_WRITTEN_THEN_ID, '')), ShareReadRefused::class, 'older view');
        $this->assertThrows(fn () => $cursors->read($text, new ShareCursor(TestIds::of(8), 1, '', 'notes', ShareCursor::ORDER_WRITTEN_THEN_ID, '')), ShareReadRefused::class);
        $this->assertThrows(fn () => $cursors->read($text.'x', $place), ShareReadRefused::class);
    }

    /**
     * Registers a fixture domain's share records and gateways as the sharing provider does at boot.
     */
    private function registerShareDomain(Domain $domain): void
    {
        if ($domain instanceof ProvidesShareRecords) {
            $this->app->make(ShareRecordRegistry::class)->registerFrom($domain);
        }

        if ($domain instanceof ProvidesShareGateways) {
            $this->app->make(ShareGatewayRegistry::class)->registerFrom($domain);
        }
    }
}
