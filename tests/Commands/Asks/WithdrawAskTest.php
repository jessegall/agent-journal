<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Asks\Commands\AskSupervisor\AskSupervisorCommand;
use App\Asks\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Asks\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Asks\Contracts\AskReader;
use App\Asks\Exceptions\AskRefused;
use App\Bus\Contracts\CommandBus;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Models\Records\AssignmentRecord;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Profiles\ProfileProposal;
use App\Support\ActorReference;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

#[TestsCommand(WithdrawAskCommand::class)]
final class WithdrawAskTest extends TestCase
{
    use CommitsHookRows;

    private const string INPUT_ADVICE = 'Check the input file.';

    private const array TABLES = [
        'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'session_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
        'agent_stacks', 'tasks',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_replay_and_closing_asks_are_available_at_the_open_limit(): void
    {
        $this->activateProfiles();
        $requester = $this->journal->idleAgent('Requester', 'journal-worker')->agentCalled('Requester');
        $recipient = $this->journal->idleAgent('Supervisor', 'journal-code-reviewer')->agentCalled('Supervisor');
        $this->journal->actAsAgentIds($requester->id, TestIds::of(91));
        $commands = $this->app->make(CommandBus::class);

        $first = $commands->run(new AskSupervisorCommand('First question', 'first'));
        $second = $commands->run(new AskSupervisorCommand('Second question', 'second'));

        foreach (['third', 'fourth', 'fifth'] as $ordinal) {
            $commands->run(new AskSupervisorCommand('Another question', $ordinal));
        }

        $this->assertThrows(fn () => $commands->run(new AskSupervisorCommand('One more', 'sixth')), AskRefused::class);
        $this->assertEquals($first, $commands->run(new AskSupervisorCommand('First question', 'first')));
        $this->assertThrows(fn () => $commands->run(new AskSupervisorCommand('Changed', 'first')), AskRefused::class);

        $this->journal->actAsAgentIds($recipient->id, TestIds::of(92));
        $inbox = $this->app->make(AskReader::class);
        $this->assertTrue($inbox->card($first)->isObligation);
        $commands->run(new ReplyToAskCommand($first, 'Check the input file.'));

        $this->journal->actAsAgentIds($requester->id, TestIds::of(91));
        $commands->run(new WithdrawAskCommand($second));
        $this->assertSame(self::INPUT_ADVICE, $inbox->card($first)->reply);
        $this->assertFalse($inbox->card($second)->isOpen);
        $this->assertSame(3, Ask::resolveOpenSubmissions(ActorReference::of($requester)));
        $this->assertSame(3, AssignmentRecord::query()->count());
        $this->assertSame(
            AskHop::PENDING_DELIVERY,
            AskHop::query()->where('ask_id', $first->id)->firstOrFail()->attention,
        );
    }

    private function activateProfiles(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
    }
}
