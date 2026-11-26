<?php

declare(strict_types=1);

namespace Tests\Unit\AgentRequests;

use App\Exceptions\StateBlocked;
use App\Pipelines\RunSignedCallPipeline;
use App\Support\PipelineRunner;
use App\Values\CommandReport;
use App\Values\PendingPayload;
use Tests\Fixtures\AgentRequests\NoteAnswer;
use Tests\Fixtures\AgentRequests\WriteNotePayload;
use Tests\Support\RecordedPayloads;
use Tests\TestCase;

/**
 * The one-call pipeline sends a call through whatever sender is bound and reports its answer; the RecordedPayloads fake
 * answers, refuses and records.
 */
final class RecordedPayloadsTest extends TestCase
{
    public function test_the_pipeline_reports_the_recorded_answer_as_json(): void
    {
        $calls = RecordedPayloads::bind()->answer(WriteNotePayload::class, new NoteAnswer('note-1'));

        $report = $this->app->make(PipelineRunner::class)->run(
            RunSignedCallPipeline::class,
            new PendingPayload($this->noteCall(), true),
            CommandReport::class,
        );

        $calls->assertSent(WriteNotePayload::class);
        $this->assertSame('{"noteId":"note-1"}', $report->lines[0]->text);
    }

    public function test_a_recorded_refusal_is_thrown_and_nothing_is_sent_before_a_call(): void
    {
        $calls = RecordedPayloads::bind();
        $calls->assertNothingSent();
        $calls->refuse(WriteNotePayload::class, StateBlocked::answered('state_blocked', 'Blocked.', 'call-1', null, []));

        $this->expectException(StateBlocked::class);

        $this->app->make(PipelineRunner::class)->run(
            RunSignedCallPipeline::class,
            new PendingPayload($this->noteCall()),
            CommandReport::class,
        );
    }

    private function noteCall(): WriteNotePayload
    {
        return WriteNotePayload::from(['notebookId' => 'book-1', 'text' => 'Hi.', 'request_key' => 'key-1']);
    }
}
