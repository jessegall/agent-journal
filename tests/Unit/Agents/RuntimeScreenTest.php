<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Files\Contracts\Files;
use App\Recordings\Recordings;
use App\Terminals\Data\ScreenFrameData;
use App\Terminals\Enums\ScreenBuffer;
use App\Terminals\RuntimeScreen;
use App\Terminals\ScreenRegistration;
use Carbon\CarbonImmutable;
use Tests\Support\Recordings\RecordedTerminal;
use Tests\TestCase;

/**
 * A host's frame hydrates from the JSON the Go host sends, and the cache keeps only each runtime's latest frame under
 * its identity: a late frame is ignored, a restarted host starts afresh and its old epoch is retired, a reader of
 * another registration sees nothing, and a minute without frames leaves nothing.
 */
final class RuntimeScreenTest extends TestCase
{
    public function test_a_frame_hydrates_from_what_the_host_sends(): void
    {
        $payload = $this->payload('epoch-1', 7);
        $frame = ScreenFrameData::from($payload);

        $this->assertSame('epoch-1', $frame->epoch);
        $this->assertSame(7, $frame->sequence);
        $this->assertSame(ScreenBuffer::Normal, $frame->buffer);
        $this->assertFalse($frame->isTooLarge);
        $this->assertFalse($frame->hasNoTerminal);
        $this->assertSame($payload['columns'], $frame->columns);
        $this->assertSame($payload['rows'][0][0]['text'], $frame->rows[0]->runs[0]->text);
        $this->assertNull($frame->rows[0]->runs[0]->style->bg);
        $this->assertSame($payload['cursor'], $frame->cursor->toArray());
        $this->assertSame($frame->rows[0]->runs[0]->text, $frame->toArray()['rows'][0]['runs'][0]['text']);
        $this->assertArrayHasKey('isTooLarge', $frame->toArray());
    }

    public function test_a_shield_frame_hydrates_its_privacy_and_an_older_host_frame_is_public(): void
    {
        $shield = ScreenFrameData::from([
            ...$this->payload('epoch-1', 3),
            'rows' => [],
            'is_shielded' => true,
            'privacy_revision' => 2,
        ]);
        $older = $this->frame('epoch-1', 3);

        $this->assertSame([true, 2, []], [$shield->isShielded, $shield->privacyRevision, $shield->rows]);
        $this->assertSame([false, 0], [$older->isShielded, $older->privacyRevision]);
    }

    public function test_a_frame_hydrates_its_stream_and_liveness_proof(): void
    {
        $frame = ScreenFrameData::from([
            ...$this->payload('epoch-1', 1),
            'stream' => 'stream-1',
            'proof' => 4,
            'expires_at' => '2026-11-19T12:00:15.123456789Z',
        ]);
        $older = $this->frame('epoch-1', 1);

        $this->assertSame(
            ['stream-1', 4, '2026-11-19T12:00:15.123456789Z'],
            [$frame->stream, $frame->proof, $frame->expiresAt],
        );
        $this->assertSame([null, 0, null], [$older->stream, $older->proof, $older->expiresAt]);
    }

    public function test_admit_then_latest_gives_the_frame_and_a_late_frame_changes_nothing(): void
    {
        $screen = $this->app->make(RuntimeScreen::class);
        $now = CarbonImmutable::parse('2026-11-19 12:00:00');
        $registration = new ScreenRegistration('runtime-1', 'host-1', 1);

        $this->assertTrue($screen->admit($registration, $this->frame('epoch-1', 5), $now));
        $this->assertFalse($screen->admit($registration, $this->frame('epoch-1', 4), $now->addSecond()));

        $latest = $screen->latest($registration);
        $this->assertSame(5, $latest?->frame->sequence);
        $this->assertTrue($latest->receivedAt->equalTo($now));
        $this->assertNull($screen->latest(new ScreenRegistration('runtime-2', 'host-1', 1)));
    }

    public function test_a_frame_of_a_new_epoch_replaces_the_stored_one_and_the_old_epoch_is_retired(): void
    {
        $screen = $this->app->make(RuntimeScreen::class);
        $now = CarbonImmutable::parse('2026-11-19 12:00:00');
        $registration = new ScreenRegistration('runtime-1', 'host-1', 1);

        $screen->admit($registration, $this->frame('epoch-1', 50), $now);
        $screen->admit($registration, $this->frame('epoch-2', 1), $now);

        $this->assertFalse($screen->admit($registration, $this->frame('epoch-1', 51), $now));
        $this->assertSame(['epoch-2', 1], [
            $screen->latest($registration)?->frame->epoch,
            $screen->latest($registration)?->frame->sequence,
        ]);
    }

    public function test_a_reader_expecting_another_generation_or_host_sees_nothing(): void
    {
        $screen = $this->app->make(RuntimeScreen::class);
        $registration = new ScreenRegistration('runtime-1', 'host-1', 1);
        $screen->admit($registration, $this->frame('epoch-1', 1), CarbonImmutable::now());

        $this->assertNull($screen->latest(new ScreenRegistration('runtime-1', 'host-1', 2)));
        $this->assertNull($screen->latest(new ScreenRegistration('runtime-1', 'host-2', 1)));
    }

    public function test_a_minute_without_frames_leaves_nothing(): void
    {
        $screen = $this->app->make(RuntimeScreen::class);
        $registration = new ScreenRegistration('runtime-1', 'host-1', 1);
        $screen->admit($registration, $this->frame('epoch-1', 1), CarbonImmutable::now());

        $this->travel(RuntimeScreen::KEEP_SECONDS + 1)->seconds();

        $this->assertNull($screen->latest($registration));
    }

    /**
     * A frame as the Go host encodes it: snake case keys, and default style keys left out.
     */
    private function frame(string $epoch, int $sequence): ScreenFrameData
    {
        return ScreenFrameData::from($this->payload($epoch, $sequence));
    }

    /**
     * The JSON an older Go host sends for a frame, decoded, without the privacy fields.
     *
     * @return array<string, mixed>
     */
    private function payload(string $epoch, int $sequence): array
    {
        $terminal = RecordedTerminal::from($this->app->make(Recordings::class), 'claude-code', 'first-start');
        $frames = $terminal->frames($this->app->make(Files::class));
        $frame = $frames[0]['frame'];

        return [
            'epoch' => $epoch,
            'sequence' => $sequence,
            'captured' => '2026-11-19T12:00:00.123456789Z',
            'columns' => $frame['columns'],
            'rows' => array_map(fn (string $row) => [['text' => $row]], $frame['rows']),
            'cursor' => ['row' => $frame['cursor_row'], 'column' => $frame['cursor_column'], 'isVisible' => true],
            'buffer' => $frame['buffer'],
            'is_plain' => true,
            'is_too_large' => false,
            'is_unreadable' => false,
            'has_no_terminal' => false,
        ];
    }
}
