<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Accounts\Commands\RecordThreadTokens\RecordThreadTokensCommand;
use App\Accounts\Commands\RecordUsageWindow\RecordUsageWindowCommand;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\UsageWindowSlot;
use App\Agents\Commands\ChooseRuntimeConversation\ChooseRuntimeConversationCommand;
use App\Agents\Commands\RefuseAccountStarts\RefuseAccountStartsCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Agents\Drivers\Enums\CodexAgentFeature;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Work\AccountOwners;
use App\Agents\Values\UsageSource;
use App\Attributes\Rules\DecodesAnyJson;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Commands\WriteHostInput\WriteHostInputCommand;
use App\Models\Accounts\Account;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Support\Command;
use App\Time\Contracts\ServerClock;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostInstructionSource;
use App\Values\ReportedStart;
use App\Values\ThreadTokens;
use App\Values\TurnEnd;
use App\Values\UsageWindowReading;

/**
 * Drives one `codex app-server` that runs every headless turn of an account on its host: the handshake and sign-in
 * check, a thread per runtime, a turn per delivery or wake, interrupts, and the turn ends, token counts and rate limits
 * it sends. Each message id names its request, attempt and step.
 */
final class CodexAppDriver implements ProcessDriver
{
    private const string INITIALIZE_ID = 'owner.initialize';

    private const string ACCOUNT_ID = 'owner.account';

    private const string THREAD_STEP = 'thread';

    private const string RESUME_STEP = 'resume';

    private const string TURN_STEP = 'turn';

    private const string INTERRUPT_STEP = 'interrupt';

    /**
     * The status the end of a turn reads when its owner ended under it, which fails the turn.
     */
    private const string OWNER_EXITED = 'ownerExited';

    private const int STOP_GRACE_MS = 5000;

    private const int STOP_FORCE_MS = 5000;

    /**
     * The account type account/read answers for each sign-in method an owner accepts.
     */
    private const array ACCOUNT_TYPES = [
        SignInMethod::OAuth->value => 'chatgpt',
        SignInMethod::ApiKey->value => 'apiKey',
    ];

    private string $unfinishedLine = '';

    private int $linesRead = 0;

    private bool $isAccountChecked = false;

    /**
     * The requests claimed before the account was checked, which run once it is.
     *
     * @var list<ClaimedRequest>
     */
    private array $waiting = [];

    /**
     * The requests whose thread is being started or resumed, by message id, which start their turn on its answer.
     *
     * @var array<string, ClaimedRequest>
     */
    private array $awaitingThread = [];

    /**
     * The thread each turn being started runs on, by the message id of its turn/start.
     *
     * @var array<string, string>
     */
    private array $startingTurns = [];

    /**
     * Each runtime's thread, by runtime id.
     *
     * @var array<string, string>
     */
    private array $threads = [];

    /**
     * The turn running on each thread with the request and attempt it runs for, by thread id.
     *
     * @var array<string, array{turn: string, request: string, attempt: int}>
     */
    private array $turns = [];

    /**
     * The interrupts claimed while a turn ran, by thread id, each settled when that turn ends.
     *
     * @var array<string, array<string, int>>
     */
    private array $interrupts = [];

    private readonly SessionProcess $ownedStart;

    public function __construct(
        private readonly HostProcess $process,
        private readonly int $generation,
        private readonly ServerClock $clock,
        private readonly AccountOwners $owners,
    ) {
        $this->ownedStart = $process->sessionProcess()->sole();
    }

    public function resume(array $inFlight, array $ordered): DriverActions
    {
        // Only the owner's first worker writes the handshake; a later one reads its answers again from the feed.
        if ($this->generation !== 1) {
            return DriverActions::none();
        }

        $client = ['clientInfo' => [
            'name' => 'journal',
            'version' => '6',
        ]];

        return $this->write(self::INITIALIZE_ID, 'initialize', $client);
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        if ($entry->chunk?->stream !== 'stdout') {
            return DriverActions::none();
        }

        $lines = explode("\n", $this->unfinishedLine.$entry->printed());
        $this->unfinishedLine = (string) array_pop($lines);
        $actions = DriverActions::none();

        foreach ($lines as $line) {
            $this->linesRead++;
            $actions = $actions->then($this->onMessage($this->readLine($line)));
        }

        return $actions;
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        if (! $this->isAccountChecked) {
            $this->waiting[] = $request;

            return DriverActions::none();
        }

        return match (DriverOperation::tryFrom($request->operation)) {
            DriverOperation::Deliver, DriverOperation::Wake => $this->runTurn($request),
            DriverOperation::Interrupt => $this->interrupt($request),
            DriverOperation::Stop => $this->stop($request),
            default => DriverActions::none(),
        };
    }

    public function onAnswer(HostInstruction $instruction): DriverActions
    {
        return DriverActions::none();
    }

    /**
     * @param  Command<mixed>  $command
     */
    public function onAnswered(Command $command, mixed $answer): DriverActions
    {
        return DriverActions::none();
    }

    public function onExit(): DriverActions
    {
        $ended = new TurnEnd(codexStatus: self::OWNER_EXITED);
        $reports = [];

        foreach (array_keys($this->turns) as $thread) {
            $reports = [
                ...$reports,
                ...$this->endReports($thread, $ended),
            ];
        }

        foreach ($this->waiting as $request) {
            $reports[] = $this->report($request->requestId, $request->attempt, $ended, null);
        }

        return DriverActions::of(...$reports);
    }

    /**
     * @param  array<array-key, mixed>  $message
     */
    private function onMessage(array $message): DriverActions
    {
        $id = $message['id'] ?? null;

        if (is_string($id) && ! array_key_exists('method', $message)) {
            return $this->onReply($id, $message);
        }

        $params = is_array($message['params'] ?? null) ? $message['params'] : [];

        return match ($message['method'] ?? null) {
            'turn/completed' => $this->onTurnCompleted($params),
            'thread/tokenUsage/updated' => $this->onTokens($params),
            'account/rateLimits/updated' => $this->onRateLimits($params),
            default => DriverActions::none(),
        };
    }

    /**
     * @param  array<array-key, mixed>  $reply
     */
    private function onReply(string $id, array $reply): DriverActions
    {
        $result = is_array($reply['result'] ?? null) ? $reply['result'] : [];

        if ($id === self::INITIALIZE_ID) {
            return $this->notify('initialized')->then($this->write(self::ACCOUNT_ID, 'account/read', []));
        }

        if ($id === self::ACCOUNT_ID) {
            return $this->onAccount($result);
        }

        [$requestId, $attempt, $step] = $this->stepOf($id);

        if (array_key_exists('error', $reply)) {
            unset($this->awaitingThread[$id]);

            return DriverActions::of($this->report($requestId, $attempt, new TurnEnd(codexStatus: 'failed'), null));
        }

        return match ($step) {
            self::THREAD_STEP, self::RESUME_STEP => $this->onThread($id, $result),
            self::TURN_STEP => $this->onTurnStarted($id, $requestId, $attempt, $result),
            default => DriverActions::none(),
        };
    }

    /**
     * @param  array<array-key, mixed>  $result
     */
    private function onAccount(array $result): DriverActions
    {
        $method = Account::resolveMethodOf($this->ownedStart->account_id);
        $expected = self::ACCOUNT_TYPES[$method?->value] ?? null;
        $read = is_array($result['account'] ?? null) ? ($result['account']['type'] ?? null) : null;

        if ($expected === null || $read !== $expected) {
            return DriverActions::of(
                new RefuseAccountStartsCommand($this->process->id),
                new StopHostProcessCommand(
                    $this->process->id,
                    self::STOP_GRACE_MS,
                    self::STOP_FORCE_MS,
                    HostInstructionSource::forWorker($this->generation),
                ),
            );
        }

        $this->isAccountChecked = true;
        $waiting = $this->waiting;
        $this->waiting = [];
        $actions = DriverActions::none();

        foreach ($waiting as $request) {
            $actions = $actions->then($this->onRequest($request));
        }

        return $actions;
    }

    /**
     * A delivery or wake runs as a turn on the runtime's thread: started first when the runtime has none, resumed
     * when an owner before this one started it; a bootstrap only binds the thread.
     */
    private function runTurn(ClaimedRequest $request): DriverActions
    {
        $thread = $this->threads[$request->runtimeId] ?? null;

        if ($thread !== null) {
            return $this->onThreadOf($request, $thread);
        }

        $runtime = AgentRuntime::query()->findOrFail($request->runtimeId);
        // A runtime's conversation is a Codex thread once Codex named it or its start chose one; before that it is the
        // journal's own.
        $known = $runtime->continuesConversation() ? $runtime->conversation_id : null;

        if ($known !== null) {
            $id = $this->idOf($request, self::RESUME_STEP);
            $this->awaitingThread[$id] = $request;

            $source = $this->sourceOf($request, self::RESUME_STEP);

            return $this->write($id, 'thread/resume', ['threadId' => $known], $source);
        }

        $id = $this->idOf($request, self::THREAD_STEP);
        $this->awaitingThread[$id] = $request;

        $params = [
            'cwd' => $runtime->canonical_folder,
            'sandbox' => CodexArguments::NO_SANDBOX,
            'approvalPolicy' => 'never',
            'model' => $request->model ?? $runtime->startModel(),
            'config' => $this->featuresOff(),
        ];

        return $this->write($id, 'thread/start', $params, $this->sourceOf($request, self::THREAD_STEP));
    }

    /**
     * @param  array<array-key, mixed>  $result
     */
    private function onThread(string $id, array $result): DriverActions
    {
        $request = $this->awaitingThread[$id] ?? null;
        unset($this->awaitingThread[$id]);
        $thread = is_array($result['thread'] ?? null) ? ($result['thread']['id'] ?? null) : null;

        // An answer a worker before this one waited for is only read: that worker's request runs again on its retry.
        if ($request === null || ! is_string($thread)) {
            return DriverActions::none();
        }

        $this->threads[$request->runtimeId] = $thread;
        $chosen = DriverActions::of(new ChooseRuntimeConversationCommand($request->runtimeId, $thread));

        return $chosen->then($this->onThreadOf($request, $thread));
    }

    /**
     * A bootstrap only binds the runtime's thread; a delivery or wake starts its turn on it.
     */
    private function onThreadOf(ClaimedRequest $request, string $thread): DriverActions
    {
        if ($request->shouldBootstrap) {
            return $this->bootstrapped($request, $thread);
        }

        return $this->startTurn($request, $thread);
    }

    private function bootstrapped(ClaimedRequest $request, string $thread): DriverActions
    {
        return DriverActions::of(new NotifyRequestProgressCommand(
            $this->process->host_id,
            $request->requestId,
            $request->attempt,
            RequestProgress::Applied,
            $thread,
            null,
        ));
    }

    private function startTurn(ClaimedRequest $request, string $thread): DriverActions
    {
        $runtime = AgentRuntime::query()->findOrFail($request->runtimeId);

        $params = [
            'threadId' => $thread,
            'input' => [[
                'type' => 'text',
                'text' => $request->prompt(),
            ]],
            'model' => $request->model ?? $runtime->startModel(),
            'effort' => $request->effort ?? $runtime->startEffort(),
        ];

        $id = $this->idOf($request, self::TURN_STEP);
        $this->startingTurns[$id] = $thread;

        return $this->write($id, 'turn/start', array_filter($params), $this->sourceOf($request, self::TURN_STEP));
    }

    /**
     * @param  array<array-key, mixed>  $result
     */
    private function onTurnStarted(string $id, string $requestId, int $attempt, array $result): DriverActions
    {
        $turn = is_array($result['turn'] ?? null) ? ($result['turn']['id'] ?? null) : null;
        $thread = $this->startingTurns[$id] ?? null;
        unset($this->startingTurns[$id]);

        if (! is_string($turn) || $thread === null) {
            return DriverActions::none();
        }

        $this->turns[$thread] = [
            'turn' => $turn,
            'request' => $requestId,
            'attempt' => $attempt,
        ];

        return DriverActions::of(new NotifyRequestProgressCommand(
            $this->process->host_id,
            $requestId,
            $attempt,
            RequestProgress::Applying,
            $thread,
            null,
        ));
    }

    /**
     * @param  array<array-key, mixed>  $params
     */
    private function onTurnCompleted(array $params): DriverActions
    {
        $thread = $params['threadId'] ?? null;
        $status = is_array($params['turn'] ?? null) ? ($params['turn']['status'] ?? null) : null;

        if (! is_string($thread) || ! is_string($status) || ! array_key_exists($thread, $this->turns)) {
            return DriverActions::none();
        }

        return DriverActions::of(...$this->endReports($thread, new TurnEnd(codexStatus: $status)));
    }

    /**
     * The end of the thread's running turn, and of every interrupt claimed while it ran.
     *
     * @return list<NotifyRequestProgressCommand>
     */
    private function endReports(string $thread, TurnEnd $end): array
    {
        $running = $this->turns[$thread];
        $reports = [$this->report($running['request'], $running['attempt'], $end, $thread)];

        foreach ($this->interrupts[$thread] ?? [] as $requestId => $attempt) {
            $reports[] = $this->report($requestId, $attempt, $end, $thread);
        }

        unset($this->turns[$thread], $this->interrupts[$thread]);

        return $reports;
    }

    private function interrupt(ClaimedRequest $request): DriverActions
    {
        $thread = $this->threads[$request->runtimeId] ?? null;
        $running = $thread === null ? null : ($this->turns[$thread] ?? null);

        // A runtime with no turn running is idle already, so its interrupt is done.
        if ($thread === null || $running === null) {
            return DriverActions::of($this->report($request->requestId, $request->attempt, new TurnEnd(), null));
        }

        $this->interrupts[$thread][$request->requestId] = $request->attempt;

        $params = [
            'threadId' => $thread,
            'turnId' => $running['turn'],
        ];

        $id = $this->idOf($request, self::INTERRUPT_STEP);

        return $this->write($id, 'turn/interrupt', $params, $this->sourceOf($request, self::INTERRUPT_STEP));
    }

    /**
     * A stop interrupts the runtime's running turn and is done; the owner itself stops once it serves no other
     * runtime.
     */
    private function stop(ClaimedRequest $request): DriverActions
    {
        $actions = $this->interrupt($request);
        $others = $this->owners->runtimesOf($this->process)->whereKeyNot($request->runtimeId)->notStopping()->exists();

        if ($others) {
            return $actions;
        }

        return $actions->then(DriverActions::of(new StopHostProcessCommand(
            $this->process->id,
            self::STOP_GRACE_MS,
            self::STOP_FORCE_MS,
            $this->sourceOf($request, DriverOperation::Stop->value),
        )));
    }

    /**
     * @param  array<array-key, mixed>  $params
     */
    private function onTokens(array $params): DriverActions
    {
        $thread = $params['threadId'] ?? null;
        $usage = is_array($params['tokenUsage'] ?? null) ? $params['tokenUsage'] : [];
        $total = is_array($usage['total'] ?? null) ? $usage['total'] : [];
        $last = is_array($usage['last'] ?? null) ? $usage['last'] : [];

        if (! is_string($thread) || ! is_int($total['totalTokens'] ?? null)) {
            return DriverActions::none();
        }

        $tokens = new ThreadTokens(
            $thread,
            $total['totalTokens'],
            $this->count($total, 'inputTokens'),
            $this->count($total, 'cachedInputTokens'),
            $this->count($total, 'outputTokens'),
            $this->count($total, 'reasoningOutputTokens'),
            $this->count($last, 'totalTokens'),
            $this->sourceNamed('tokens'),
        );

        return DriverActions::of(new RecordThreadTokensCommand($this->reportedStart(), $tokens));
    }

    /**
     * @param  array<array-key, mixed>  $params
     */
    private function onRateLimits(array $params): DriverActions
    {
        $limits = is_array($params['rateLimits'] ?? null) ? $params['rateLimits'] : [];
        $limitId = is_string($limits['limitId'] ?? null) ? $limits['limitId'] : 'codex';
        $readings = [];

        foreach ([
            UsageWindowSlot::Primary,
            UsageWindowSlot::Secondary,
        ] as $slot) {
            $window = $limits[$slot->value] ?? null;

            if (! is_array($window) || ! is_numeric($window['usedPercent'] ?? null)) {
                continue;
            }

            $readings[] = new RecordUsageWindowCommand($this->reportedStart(), new UsageWindowReading(
                $limitId,
                $slot,
                (float) $window['usedPercent'],
                $this->count($window, 'windowDurationMins'),
                $this->count($window, 'resetsAt'),
                $this->sourceNamed("window:{$slot->value}"),
            ));
        }

        return DriverActions::of(...$readings);
    }

    private function report(
        string $requestId,
        int $attempt,
        TurnEnd $end,
        string|null $thread,
    ): NotifyRequestProgressCommand {
        return new NotifyRequestProgressCommand(
            $this->process->host_id,
            $requestId,
            $attempt,
            $end->progress(),
            $thread,
            $end->outcome(),
            turnEnd: $end,
        );
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function write(
        string $id,
        string $method,
        array $params,
        HostInstructionSource|null $source = null,
    ): DriverActions {
        $line = json_encode(['id' => $id, 'method' => $method, 'params' => (object) $params], JSON_THROW_ON_ERROR);

        return DriverActions::of(new WriteHostInputCommand(
            $this->process->id,
            "{$line}\n",
            $source ?? HostInstructionSource::forWorker($this->generation),
        ));
    }

    private function notify(string $method): DriverActions
    {
        $line = json_encode(['method' => $method], JSON_THROW_ON_ERROR);
        $source = HostInstructionSource::forWorker($this->generation);

        return DriverActions::of(new WriteHostInputCommand($this->process->id, "{$line}\n", $source));
    }

    private function idOf(ClaimedRequest $request, string $step): string
    {
        return "{$request->requestId}.{$request->attempt}.{$step}";
    }

    /**
     * @return array{string, int, string}
     */
    private function stepOf(string $id): array
    {
        $parts = explode('.', $id);

        return [
            $parts[0],
            (int) ($parts[1] ?? 0),
            $parts[2] ?? '',
        ];
    }

    private function sourceOf(ClaimedRequest $request, string $step): HostInstructionSource
    {
        return HostInstructionSource::forStep($request->requestId, $step, $request->attempt, $this->generation);
    }

    private function reportedStart(): ReportedStart
    {
        return new ReportedStart(
            $this->process->host_id,
            $this->ownedStart->start_key,
            $this->ownedStart->account_generation,
        );
    }

    private function sourceNamed(string $name): UsageSource
    {
        return UsageSource::of("{$this->process->id}:{$name}", $this->linesRead, $this->clock->now());
    }

    /**
     * @param  array<array-key, mixed>  $counts
     */
    private function count(array $counts, string $name): int|null
    {
        if (is_int($counts[$name] ?? null)) {
            return $counts[$name];
        }

        return null;
    }

    /**
     * @return array<string, false>
     */
    private function featuresOff(): array
    {
        $features = array_map(fn (CodexAgentFeature $feature) => "features.{$feature->value}", CodexAgentFeature::cases());

        return array_fill_keys($features, false);
    }

    /**
     * @return array<array-key, mixed>
     */
    #[DecodesAnyJson]
    private function readLine(string $line): array
    {
        $message = json_decode($line, true);

        if (is_array($message)) {
            return $message;
        }

        return [];
    }
}
