<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\RaiseNavigation;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\NavigationAnswerer;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\MenuEntry;
use App\Agents\Models\NavigationRequest;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\LibraryEntryAnswer;
use App\Agents\Support\NavigationDispatch;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Agents\Values\NavigationScreen;
use App\Agents\Values\NavigationUncertainty;
use App\Agents\Values\ScriptProgress;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\Config;

/**
 * Takes a host's raise at an uncertain point: the person keeps holding the main agent's own runtime, a runtime waits
 * behind another one's open request of the same menu, and any other raise opens one navigation request, holds the
 * runtime for it and puts it in front of the main desk. A repeated raise answers what the first did.
 */
final readonly class RaiseNavigationHandler implements CommandHandler
{
    private const int MOST_ROWS = 60;

    private const int MOST_ROW_CHARACTERS = 300;

    private const string FINGERPRINT = '/^fp1:[0-9a-f]{64}$/';

    public function __construct(
        private HostRuntimes $runtimes,
        private NavigationDispatch $dispatch,
        private JournalAdmission $admission,
        #[Config('agents.navigation.expire_minutes')] private int $expireMinutes,
        #[Config('agents.navigation.retry_after_seconds')] private int $retryAfterSeconds,
    ) {}

    /**
     * @throws HostReportRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(RaiseNavigation $command): NavigationRaiseAnswer
    {
        $this->checkScreen($command);
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId)->load('session.agent');
        $request = $this->stalledScript($command, $runtime);

        $raisedBefore = NavigationRequest::query()
            ->acrossActors()
            ->forRuntime($runtime)
            ->where('operation_key', $command->operationKey)
            ->first();
        if ($raisedBefore !== null) {
            return NavigationRaiseAnswer::opened($raisedBefore->id);
        }
        $owner = ActorIdentity::of($this->admission->owner());
        $library = $this->libraryAnswer($command, $runtime, $request, $owner);
        if ($library !== null) {
            return $library;
        }
        if ($this->dispatch->answererFor($runtime) === NavigationAnswerer::Person) {
            return NavigationRaiseAnswer::held();
        }
        if ($this->sameMenuOpenElsewhere($command, $runtime, $request, $owner)) {
            return NavigationRaiseAnswer::wait($this->retryAfterSeconds);
        }

        return NavigationRaiseAnswer::opened($this->open($command, $runtime, $request, $owner)->id);
    }

    /**
     * The owner's library entry for this screen and goal: one current on the runtime's build, or else one proven on
     * another build only, which the host replays guarded; none for a stale, superseded or retired entry.
     */
    private function libraryAnswer(
        RaiseNavigation $command,
        AgentRuntime $runtime,
        DriverRequest $request,
        ActorIdentity $owner,
    ): NavigationRaiseAnswer|null {
        $entries = MenuEntry::query()
            ->ownedBy($owner)
            ->current()
            ->forProgram($runtime->program)
            ->matching($command->fingerprint, $request->scriptGoal())
            ->whereNotIn('id', $command->declinedEntries)
            ->recentFirst()
            ->readLimit(20)
            ->get();
        $build = $runtime->program_build;
        $current = $entries->first(fn (MenuEntry $entry) => $entry->isCurrentOn($build));
        if ($current !== null) {
            return NavigationRaiseAnswer::entry(LibraryEntryAnswer::of($current), guarded: false);
        }
        $elsewhere = $entries->first(fn (MenuEntry $entry) => $entry->wasProvenElsewhere($build));

        if ($elsewhere === null) {
            return null;
        }

        return NavigationRaiseAnswer::entry(LibraryEntryAnswer::of($elsewhere), guarded: true);
    }

    private function open(
        RaiseNavigation $command,
        AgentRuntime $runtime,
        DriverRequest $request,
        ActorIdentity $owner,
    ): NavigationRequest {
        $request->recordScriptProgress(
            new ScriptProgress($command->step, $command->generation, 'navigation requested'),
        );
        $navigation = NavigationRequest::raised(
            $request,
            $owner,
            $this->uncertaintyOf($command),
            $command->operationKey,
            CarbonImmutable::now()->addMinutes($this->expireMinutes),
        );
        $runtime->holdFor(HoldReason::NavigationNeeded);
        $request->hold(HoldReason::NavigationNeeded);
        $this->dispatch->deliver($navigation, 0);

        return $navigation;
    }

    /**
     * The key script request of the runtime that stalled, at the attempt the host ran, with its runtime.
     *
     * @throws NavigationRaiseRefused
     * @throws HostReportRefused
     */
    private function stalledScript(RaiseNavigation $command, AgentRuntime $runtime): DriverRequest
    {
        $request = DriverRequest::query()
            ->whereKey($command->requestId)
            ->where('agent_runtime_id', $runtime->id)
            ->lockForUpdate()
            ->first()
            ?? throw NavigationRaiseRefused::notOfRuntime($command->requestId, $runtime->id);
        if ($request->operation !== DriverOperation::KeyScript) {
            throw NavigationRaiseRefused::notAKeyScript($request->id);
        }
        if ($command->attempt !== $request->attempt_version) {
            throw HostReportRefused::staleAttempt($request->id, $command->attempt, $request->attempt_version);
        }
        $request->setRelation('runtime', $runtime);

        return $request;
    }

    /**
     * Whether another runtime of the owner has an open request for the same program build, screen and goal, which
     * this runtime waits behind instead of asking the main agent twice.
     */
    private function sameMenuOpenElsewhere(
        RaiseNavigation $command,
        AgentRuntime $runtime,
        DriverRequest $request,
        ActorIdentity $owner,
    ): bool {
        $goal = $request->scriptGoal();
        $candidates = NavigationRequest::query()
            ->ownedBy($owner)
            ->open()
            ->where('agent_runtime_id', '!=', $runtime->id)
            ->where('program', $runtime->program)
            ->where('build', $runtime->program_build)
            ->where('fingerprint', $command->fingerprint)
            ->where('goal_script', $goal->script)
            ->where('goal_version', $goal->version)
            ->readLimit(50)
            ->get();

        return $candidates->contains(fn (NavigationRequest $open) => $open->goal()->key() === $goal->key());
    }

    private function uncertaintyOf(RaiseNavigation $command): NavigationUncertainty
    {
        $highlight = $command->highlight >= 0 ? $command->highlight : null;
        $screen = new NavigationScreen($command->rows, $highlight, $command->generation);

        return new NavigationUncertainty($command->reason, $command->step, $command->fingerprint, $screen);
    }

    /**
     * @throws NavigationRaiseRefused
     */
    private function checkScreen(RaiseNavigation $command): void
    {
        if (count($command->rows) > self::MOST_ROWS) {
            throw NavigationRaiseRefused::tooManyRows(count($command->rows), self::MOST_ROWS);
        }
        foreach ($command->rows as $row => $text) {
            if (mb_strlen($text) > self::MOST_ROW_CHARACTERS) {
                throw NavigationRaiseRefused::rowTooLong($row, self::MOST_ROW_CHARACTERS);
            }
        }
        if (preg_match(self::FINGERPRINT, $command->fingerprint) !== 1) {
            throw NavigationRaiseRefused::fingerprintMalformed($command->fingerprint);
        }
    }
}
