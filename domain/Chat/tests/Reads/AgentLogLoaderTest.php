<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Exceptions\StackTargetRefused;
use Domain\Chat\Data\AgentLogData;
use Domain\Chat\Data\AgentLogInput;
use Domain\Chat\Data\AgentLogLineData;
use Domain\Chat\Enums\AgentLogLineType;
use Domain\Chat\Http\Loaders\AgentLogLoader;
use Domain\Chat\Tests\TestCase;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;

/**
 * The chat's Technical details read an agent's starts from the journal's own records, newest first: a refused start
 * shows as failed, with the host's reason and the evidence behind it, in plain words that name no process id, server
 * path or request number; an agent out of sight is refused.
 */
#[TestsRead(AgentLogLoader::class)]
final class AgentLogLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    private const string REFUSAL = 'Claude Code refused the sign-in of Work (Max)';

    public function test_the_log_lists_a_failed_start_with_its_reason(): void
    {
        $this->journal->owner()->idleAgent('Planner')->startSession('Planner', 'Planner');
        $session = $this->journal->sessionCalled('Planner');
        $start = $this->journal->startOfSession($session->id);
        $start->refuse(self::REFUSAL);

        $log = $this->read($this->journal->agentCalled('Planner')->id);
        $shown = $log->starts[0];
        $refused = array_values(array_filter(
            $shown->lines,
            fn (AgentLogLineData $line) => $line->type === AgentLogLineType::StartRefused,
        ));

        $words = implode(' ', array_map(
            fn (AgentLogLineData $line) => "{$line->detail} {$line->evidence}",
            $shown->lines,
        ));

        $this->assertSame(
            [$session->id, 'Failed', true, 1, self::REFUSAL, true, false, false],
            [
                $shown->sessionId,
                $shown->outcome,
                $shown->hasFailed,
                count($refused),
                $refused[0]->reason,
                str_contains((string) $refused[0]->evidence, 'account '),
                str_contains($words, $start->id),
                str_contains($words, $start->directory),
            ],
        );
    }

    public function test_an_agent_the_viewer_cannot_see_is_refused(): void
    {
        $this->journal->owner();

        $this->expectException(StackTargetRefused::class);

        $this->read('01m8dd0sct689m9bbtqr335rad');
    }

    private function read(string $agent): AgentLogData
    {
        return $this->app->make(AgentLogLoader::class)(AgentLogInput::validateAndCreate(['agent' => $agent]));
    }
}
