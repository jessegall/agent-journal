<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Inputs\Values\StopDetails;
use App\Contracts\Events\Event as JournalEvent;
use App\Hooks\Enums\AnswerType;
use App\Sessions\States\ProfileState;
use App\Stacks\Decisions\ContextLine;
use App\Stacks\Decisions\MessageLine;
use App\Stacks\StateAnswer;
use App\Support\Command;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;

/**
 * Asks the started agent's profile state about a stop and reads its answer the way the stack gathers it: a delegate
 * lets the stop through. The commands and events it answers with run as the hook's answer runs them, as the agent.
 */
trait AsksTheProfileState
{
    /**
     * The profile state of each session asked, by session id, kept as its stack keeps it.
     *
     * @var array<string, ProfileState>
     */
    private array $profileStates = [];

    private function stop(TestStart $start, string $stopId): StateAnswer
    {
        $hook = new HookIdentity($start->agent->id, $start->session->id, $stopId, 'digest');
        $start->startRequest($this->app);
        $stop = new StopRequested($hook, new StopDetails('turn', false, ''));
        $answer = StateAnswer::of($this->profileStateOf($start)->onStop($stop), ProfileState::class, 'onStop');

        foreach ($answer->effects as $effect) {
            if ($effect instanceof Command) {
                $this->journal->runAsStart($start, $effect);
            }

            if ($effect instanceof JournalEvent) {
                Event::dispatch($effect);
            }
        }

        return $answer;
    }

    private function profileStateOf(TestStart $start): ProfileState
    {
        return $this->profileStates[$start->session->id] ??= $this->app->make(ProfileState::class, [
            'agentId' => $start->agent->id,
            'sessionId' => $start->session->id,
        ]);
    }

    private function typeOf(StateAnswer $answer): AnswerType
    {
        $type = $answer->decision->answerType();

        return $type === AnswerType::Delegate ? AnswerType::Allow : $type;
    }

    /**
     * @return list<string>
     */
    private function messagesOf(StateAnswer $answer): array
    {
        return array_map(fn (ContextLine|MessageLine $line) => TestText::words($line->text), $answer->lines);
    }
}
