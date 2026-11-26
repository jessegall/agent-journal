<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Agents\Drivers\Codex\CodexAppDriver;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\Enums\HostOrderType;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostOrder;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * One Codex app-server runs every headless turn of an account: it is opened once for the account's runtimes, shakes
 * hands and checks the account's sign-in, starts a thread per runtime and a turn per message, binds each thread as its
 * runtime's conversation, settles each turn from turn/completed, and refuses the account's starts when the server is
 * signed in another way than the account.
 */
#[TestsMachinery(CodexAppDriver::class)]
final class CodexAppDriverTest extends TestCase
{
    use RefreshHookDatabase;

    private const int WAIT_MS = 200;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->chooseActiveAccounts(config('accounts.root'))->showDriverArrangements()->idleAgent('Coder')->idleAgent('Tester')->enrollHost('Mac', [base_path()]);
    }

    public function test_an_accounts_turns_run_on_one_server_each_on_its_runtimes_own_thread(): void
    {
        $first = $this->journal->openCodexRuntimeOn('Coder', 'Mac', base_path(), 'Run: ls.');
        $this->journal->passCodexProbes('coder', $first->runtimeId);
        $second = $this->journal->openCodexRuntimeOn('Tester', 'Mac', base_path(), 'Run: pwd.');
        $this->journal->passCodexProbes('tester', $second->runtimeId);
        $this->journal->callAccountOwner('owner', $first->runtimeId);

        $work = $this->journal->beginDriverWorker('owner');
        $this->answer($work, 'owner.initialize', ['userAgent' => 'codex']);
        $this->answer($work, 'owner.account', ['account' => ['type' => 'chatgpt'], 'requiresOpenaiAuth' => true]);
        $threadStarts = $this->writtenWith('thread/start');

        foreach ($threadStarts as $index => $start) {
            $this->answer($work, $start['id'], ['thread' => ['id' => "thread-{$index}"]]);
        }

        $turnStarts = $this->writtenWith('turn/start');

        foreach ($turnStarts as $index => $turn) {
            $this->answer($work, $turn['id'], ['turn' => ['id' => "turn-{$index}", 'status' => 'inProgress']]);
        }

        $this->notify($work, 'turn/completed', ['threadId' => 'thread-0', 'turn' => ['id' => 'turn-0', 'status' => 'completed']]);
        $this->notify($work, 'turn/completed', ['threadId' => 'thread-1', 'turn' => ['id' => 'turn-1', 'status' => 'failed']]);

        $this->journal->assertResult(
            [
                ['initialize', 'initialized', 'account/read', 'thread/start', 'thread/start', 'turn/start', 'turn/start'],
                ['Run: ls.', 'Run: pwd.'],
                [RequestProgress::Applied, RequestProgress::Failed],
                ['thread-0', 'thread-1'],
            ],
            [
                array_column($this->journal->pipeInputOf('owner'), 'method'),
                array_map(fn (array $turn) => $turn['params']['input'][0]['text'], $turnStarts),
                [$this->progressOf($turnStarts[0]['id']), $this->progressOf($turnStarts[1]['id'])],
                [$this->conversationOf($first->runtimeId), $this->conversationOf($second->runtimeId)],
            ],
        );
    }

    public function test_a_server_signed_in_another_way_than_the_account_refuses_its_starts(): void
    {
        $opened = $this->journal->openCodexRuntimeOn('Coder', 'Mac', base_path(), 'Run: ls.');
        $this->journal->passCodexProbes('coder', $opened->runtimeId);
        $this->journal->callAccountOwner('owner', $opened->runtimeId);

        $work = $this->journal->beginDriverWorker('owner');
        $this->answer($work, 'owner.initialize', ['userAgent' => 'codex']);
        $this->answer($work, 'owner.account', ['account' => ['type' => 'apiKey'], 'requiresOpenaiAuth' => true]);

        $this->journal->assertResult(
            [
                'The account is not signed in by a method the journal accepts, so no turn was started.',
                HostOrderType::Stop,
                [],
            ],
            [
                $this->journal->startOfSession($opened->sessionId)->refusal,
                $this->lastOrder()->type,
                $this->writtenWith('thread/start'),
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $result
     */
    private function answer(mixed $work, string $id, array $result): void
    {
        $this->print($work, ['id' => $id, 'result' => $result]);
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function notify(mixed $work, string $method, array $params): void
    {
        $this->print($work, ['method' => $method, 'params' => $params]);
    }

    /**
     * @param  array<string, mixed>  $message
     */
    private function print(mixed $work, array $message): void
    {
        $this->journal->printOnPipe('owner', json_encode($message, JSON_THROW_ON_ERROR)."\n");
        $this->journal->stepDriverWorker($work, self::WAIT_MS);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function writtenWith(string $method): array
    {
        $written = $this->journal->pipeInputOf('owner');

        return array_values(array_filter($written, fn (array $message) => $message['method'] === $method));
    }

    private function progressOf(string $messageId): RequestProgress
    {
        return DriverRequest::query()->whereKey(explode('.', $messageId)[0])->sole()->progress;
    }

    private function conversationOf(string $runtimeId): string|null
    {
        return AgentRuntime::query()->whereKey($runtimeId)->sole()->conversation_id;
    }

    private function lastOrder(): HostOrder
    {
        $orders = $this->journal->hostOrdersOf('owner');

        return $orders[array_key_last($orders)];
    }
}
