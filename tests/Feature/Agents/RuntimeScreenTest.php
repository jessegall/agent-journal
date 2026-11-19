<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Data\ScreenFrameData;
use App\Agents\Enums\ScreenBuffer;
use App\Agents\Support\RuntimeScreen;
use Carbon\CarbonImmutable;
use Tests\TestCase;

/**
 * A host's frame hydrates from the JSON the Go host sends, and the cache keeps only each runtime's latest frame: a
 * late frame is ignored, a restarted host starts afresh, and a minute without frames leaves nothing.
 */
final class RuntimeScreenTest extends TestCase
{
    public function test_a_frame_hydrates_from_what_the_host_sends(): void
    {
        $frame = $this->frame('epoch-1', 7);

        $this->assertSame('epoch-1', $frame->epoch);
        $this->assertSame(ScreenBuffer::Alternate, $frame->buffer);
        $this->assertTrue($frame->tooLarge === false && $frame->noTerminal === false);
        $this->assertSame('red', $frame->rows[0]->runs[1]->text);
        $this->assertSame('#cd0000', $frame->rows[0]->runs[1]->style->fg);
        $this->assertTrue($frame->rows[0]->runs[1]->style->bold);
        $this->assertSame('', $frame->rows[0]->runs[0]->style->bg);
        $this->assertSame([], $frame->rows[1]->runs);
        $this->assertSame(['row' => 1, 'column' => 4, 'visible' => false], $frame->cursor->toArray());
        $this->assertSame('red', $frame->toArray()['rows'][0]['runs'][1]['text']);
        $this->assertArrayHasKey('tooLarge', $frame->toArray());
    }

    public function test_put_then_latest_gives_the_frame_and_a_late_frame_changes_nothing(): void
    {
        $screen = $this->app->make(RuntimeScreen::class);
        $now = CarbonImmutable::parse('2026-11-19 12:00:00');

        $screen->put('runtime-1', $this->frame('epoch-1', 5), $now);
        $screen->put('runtime-1', $this->frame('epoch-1', 4), $now->addSecond());

        $latest = $screen->latest('runtime-1');
        $this->assertSame(5, $latest?->frame->sequence);
        $this->assertTrue($latest->receivedAt->equalTo($now));
        $this->assertNull($screen->latest('runtime-2'));
    }

    public function test_a_frame_of_a_new_epoch_replaces_the_stored_one(): void
    {
        $screen = $this->app->make(RuntimeScreen::class);
        $now = CarbonImmutable::parse('2026-11-19 12:00:00');

        $screen->put('runtime-1', $this->frame('epoch-1', 50), $now);
        $screen->put('runtime-1', $this->frame('epoch-2', 1), $now);

        $this->assertSame(['epoch-2', 1], [
            $screen->latest('runtime-1')?->frame->epoch,
            $screen->latest('runtime-1')?->frame->sequence,
        ]);
    }

    public function test_a_minute_without_frames_leaves_nothing(): void
    {
        $screen = $this->app->make(RuntimeScreen::class);
        $screen->put('runtime-1', $this->frame('epoch-1', 1), CarbonImmutable::now());

        $this->travel(RuntimeScreen::KEEP_SECONDS + 1)->seconds();

        $this->assertNull($screen->latest('runtime-1'));
    }

    /**
     * A frame as the Go host encodes it: snake case keys, and default style keys left out.
     */
    private function frame(string $epoch, int $sequence): ScreenFrameData
    {
        $json = <<<'JSON'
        {
            "epoch": "EPOCH",
            "sequence": 0,
            "captured": "2026-11-19T12:00:00.123456789Z",
            "columns": 20,
            "rows": [
                [{"text": "plain ", "style": {}}, {"text": "red", "style": {"fg": "#cd0000", "bold": true}}],
                []
            ],
            "cursor": {"row": 1, "column": 4, "visible": false},
            "buffer": "alternate",
            "plain": false,
            "too_large": false,
            "unreadable": false,
            "no_terminal": false
        }
        JSON;
        $payload = json_decode(str_replace('EPOCH', $epoch, $json), true, flags: JSON_THROW_ON_ERROR);
        $payload['sequence'] = $sequence;

        return ScreenFrameData::from($payload);
    }
}
