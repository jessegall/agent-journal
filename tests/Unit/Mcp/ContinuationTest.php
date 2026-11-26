<?php

declare(strict_types=1);

namespace Tests\Unit\Mcp;

use App\Contracts\Actors\CurrentActorSetter;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ContinuationStale;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\TextChunk;
use App\Mcp\Support\ToolArguments;
use App\Support\AgentContext;
use App\Support\SignedCall;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Laravel\Mcp\Request;
use Tests\TestCase;

/**
 * Signed continuation cursors, retained page references and text chunks of bounded MCP reads.
 */
final class ContinuationTest extends TestCase
{
    private const string AGENT = '01jd0000000000000000000a00';

    private const string SESSION_A = '01jd0000000000000000000a01';

    private const string SESSION_B = '01jd0000000000000000000b02';

    public function test_a_cursor_opens_to_the_continuation_it_was_issued_for(): void
    {
        $this->actAs($this->context('session-a'));
        $continuations = $this->app->make(Continuations::class);

        $continuation = $continuations->open(
            $continuations->issue(
                new Continuation('docs_read', '16', ['view' => 'body'], 33, characterOffset: 3072, revision: 2),
            ),
            'docs_read',
            '16',
        );

        $this->assertSame(['view' => 'body'], $continuation->filters);
        $this->assertSame(
            [33, 3072, 2],
            [$continuation->offset, $continuation->characterOffset, $continuation->revision],
        );
    }

    public function test_a_cursor_from_session_a_is_refused_in_session_b(): void
    {
        $this->actAs($this->context('session-a'));
        $cursor = $this->app->make(Continuations::class)->issue(new Continuation('tasks_assigned', 'tasks', [], 7));
        $this->actAs($this->context('session-b'));

        $this->expectExceptionObject(ContinuationInvalid::foreign());

        $this->app->make(Continuations::class)->open($cursor, 'tasks_assigned', 'tasks');
    }

    public function test_a_changed_byte_in_a_cursor_is_refused(): void
    {
        $this->actAs($this->context('session-a'));
        $continuations = $this->app->make(Continuations::class);
        $cursor = $continuations->issue(new Continuation('tasks_assigned', 'tasks', [], 7));
        $changed = substr_replace($cursor, $cursor[3] === 'A' ? 'B' : 'A', 3, 1);

        $this->expectExceptionObject(ContinuationInvalid::changed());

        $continuations->open($changed, 'tasks_assigned', 'tasks');
    }

    public function test_a_cursor_for_another_read_is_refused(): void
    {
        $this->actAs($this->context('session-a'));
        $continuations = $this->app->make(Continuations::class);
        $cursor = $continuations->issue(new Continuation('tasks_assigned', 'tasks', [], 7));

        $this->expectException(ContinuationInvalid::class);

        $continuations->open($cursor, 'plans_assigned', 'plans');
    }

    public function test_an_expired_cursor_is_stale(): void
    {
        $this->actAs($this->context('session-a'));
        $continuations = $this->app->make(Continuations::class);
        $cursor = $continuations->issue(new Continuation('tasks_assigned', 'tasks', [], 7));
        $this->travel(31)->minutes();

        $this->expectExceptionObject(ContinuationStale::expired());

        $continuations->open($cursor, 'tasks_assigned', 'tasks');
    }

    public function test_a_changed_revision_is_stale(): void
    {
        $this->expectExceptionObject(ContinuationStale::revisionChanged(2, 3));

        new Continuation('docs_read', '16', [], 33, revision: 2)->assertCurrentRevision(3);
    }

    public function test_a_10000_character_line_continues_by_character_offset_without_splitting_a_character(): void
    {
        $line = str_repeat('aé€😀', 2500);
        $text = <<<TEXT
        first line
        {$line}
        last line
        TEXT;
        $read = '';
        $chunk = TextChunk::of($text, 2, 0);

        while ($chunk->nextLine === 2) {
            $this->assertLessThanOrEqual(TextChunk::BYTE_LIMIT, strlen($chunk->text));
            $this->assertTrue(mb_check_encoding($chunk->text, 'UTF-8'));
            $read .= $chunk->text;
            $chunk = TextChunk::of($text, 2, $chunk->nextCharacter);
        }

        $this->assertSame($line, $read.explode("\n", $chunk->text)[0]);
        $this->assertSame(10000, mb_strlen($line));
    }

    public function test_a_chunk_stops_at_80_lines(): void
    {
        $chunk = TextChunk::of(implode("\n", range(1, 200)), 1, 0);

        $this->assertSame(80, count(explode("\n", $chunk->text)));
        $this->assertSame([81, 0, true], [$chunk->nextLine, $chunk->nextCharacter, $chunk->hasMore]);
    }

    public function test_a_continuation_sent_with_a_first_page_filter_is_invalid_input(): void
    {
        $arguments = ToolArguments::read(
            'tasks_assigned',
            new Request(['continuation' => 'cursor', 'page' => 2]),
            ['continuation', 'page'],
        );

        $this->expectExceptionObject(ContinuationInvalid::withFilters('page'));

        $arguments->continuation();
    }

    /**
     * The context of one of two sessions of the same agent.
     */
    private function context(string $session): AgentContext
    {
        $sessionId = $session === 'session-a' ? self::SESSION_A : self::SESSION_B;

        return new AgentContext(
            self::AGENT,
            $sessionId,
            new SignedCall('call-1', CarbonImmutable::now(), 'digest'),
            null,
        );
    }

    private function actAs(AgentContext $context): void
    {
        $this->app->forgetScopedInstances();
        $this->app->instance(AgentContext::class, $context);
        $this->app->make(CurrentActorSetter::class)->set($context, new OwnerAuthority('test'));
    }
}
