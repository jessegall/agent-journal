<?php

declare(strict_types=1);

namespace Tests\Feature\AgentRequests;

use App\AgentRequests\Exceptions\StateBlocked;
use App\AgentRequests\Pipelines\RunSignedCallPipeline;
use App\AgentRequests\Values\CallToSend;
use App\AgentRequests\Values\CommandReport;
use App\Pipelines\Support\Pipelines;
use Tests\Fixtures\AgentRequests\NoteAnswer;
use Tests\Fixtures\AgentRequests\WriteNoteCall;
use Tests\Support\RecordedCalls;
use Tests\TestCase;

/**
 * The one-call pipeline sends a call through whatever sender is bound and reports its answer; the RecordedCalls fake
 * answers, refuses and records.
 */
final class RecordedCallsTest extends TestCase
{
    public function test_the_pipeline_reports_the_recorded_answer_as_json(): void
    {
        $calls = RecordedCalls::bind()->answer(WriteNoteCall::class, new NoteAnswer('note-1'));

        $report = $this->app->make(Pipelines::class)->run(
            RunSignedCallPipeline::class,
            new CallToSend($this->noteCall(), true),
            CommandReport::class,
        );

        $calls->assertSent(WriteNoteCall::class);
        $this->assertSame('{"noteId":"note-1"}', $report->lines[0]->text);
    }

    public function test_a_recorded_refusal_is_thrown_and_nothing_is_sent_before_a_call(): void
    {
        $calls = RecordedCalls::bind();
        $calls->assertNothingSent();
        $calls->refuse(WriteNoteCall::class, StateBlocked::answered('state_blocked', 'Blocked.', 'call-1', null, []));

        $this->expectException(StateBlocked::class);

        $this->app->make(Pipelines::class)->run(
            RunSignedCallPipeline::class,
            new CallToSend($this->noteCall()),
            CommandReport::class,
        );
    }

    private function noteCall(): WriteNoteCall
    {
        return WriteNoteCall::from(['notebookId' => 'book-1', 'text' => 'Hi.', 'request_key' => 'key-1']);
    }
}
