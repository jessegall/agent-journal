<?php

declare(strict_types=1);

namespace Tests\Feature\AgentRequests;

use App\AgentRequests\Contracts\CallSender;
use App\AgentRequests\Exceptions\AnswerUnreadable;
use App\AgentRequests\Exceptions\CallTooLarge;
use App\AgentRequests\Exceptions\JournalUnavailable;
use App\AgentRequests\Exceptions\StateBlocked;
use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\LaunchProfilePin;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Sleep;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\AgentRequests\NoteAnswer;
use Tests\Fixtures\AgentRequests\WriteNoteCall;
use Tests\TestCase;

/**
 * A declared call goes out with its path values encoded into the path and the rest in the body, and comes back as its
 * typed answer; each way it can fail raises its own class.
 */
final class SendSignedCallsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Sleep::fake();
        $this->app->instance(
            AgentClientSettings::class,
            new AgentClientSettings('http://journal.test', 'launch-token', new LaunchProfilePin('main-agent', 1)),
        );
    }

    public function test_the_call_goes_out_and_its_answer_comes_back_typed(): void
    {
        Http::fake(['*' => Http::response(['noteId' => 'note-7'])]);

        $answer = $this->sender()->send(
            WriteNoteCall::from(['notebookId' => 'book 1', 'text' => 'Hello.', 'request_key' => 'key-1']),
        );

        $this->assertInstanceOf(NoteAnswer::class, $answer);
        $this->assertSame('note-7', $answer->noteId);
        Http::assertSent(fn (Request $request) => $request->url() === 'http://journal.test/agent/notes/book%201/write'
            && $request->data() === ['text' => 'Hello.', 'request_key' => 'key-1']);
    }

    /**
     * @return iterable<string, array{int, mixed, class-string<\Throwable>}>
     */
    public static function failures(): iterable
    {
        yield 'a coded refusal' => [409, ['code' => 'state_blocked', 'message' => 'Blocked.'], StateBlocked::class];
        yield 'a proxy page' => [502, '<html>Bad gateway</html>', JournalUnavailable::class];
        yield 'a too large answer' => [413, '', CallTooLarge::class];
        yield 'a wrong answer shape' => [200, ['noteId' => ['not', 'text']], AnswerUnreadable::class];
        yield 'an answer that is not JSON' => [200, 'not json', AnswerUnreadable::class];
    }

    /**
     * @param  class-string<\Throwable>  $class
     */
    #[DataProvider('failures')]
    public function test_each_failure_raises_its_class(int $status, mixed $body, string $class): void
    {
        Http::fake(['*' => Http::response($body, $status)]);

        $this->assertThrows(
            fn () => $this->sender()->send(
                WriteNoteCall::from(['notebookId' => 'book-1', 'text' => 'Hi.', 'request_key' => 'key-1']),
            ),
            $class,
        );
    }

    public function test_a_busy_answer_is_sent_again_with_the_same_call_and_answers_on_the_second_attempt(): void
    {
        Http::fakeSequence()
            ->push(['code' => 'busy', 'message' => 'Busy.'], 429)
            ->push(['noteId' => 'note-8']);

        $answer = $this->sender()->send(
            WriteNoteCall::from(['notebookId' => 'book-1', 'text' => 'Hi.', 'request_key' => 'key-1']),
        );

        $this->assertSame('note-8', $answer->noteId);
        $ids = [];
        Http::assertSent(function (Request $request) use (&$ids) {
            $ids[] = $request->header('X-Journal-Call-Id')[0] ?? '';

            return true;
        });
        $this->assertCount(2, $ids);
        $this->assertSame($ids[0], $ids[1]);
    }

    public function test_a_refusal_is_sent_once(): void
    {
        Http::fake(['*' => Http::response(['code' => 'state_blocked', 'message' => 'Blocked.'], 409)]);

        $this->assertThrows(
            fn () => $this->sender()->send(
                WriteNoteCall::from(['notebookId' => 'book-1', 'text' => 'Hi.', 'request_key' => 'key-1']),
            ),
            StateBlocked::class,
        );
        Http::assertSentCount(1);
    }

    private function sender(): CallSender
    {
        return $this->app->make(CallSender::class);
    }
}
