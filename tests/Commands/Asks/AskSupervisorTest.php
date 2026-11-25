<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Commands\Asks\AskSupervisor\AskSupervisorCommand;
use App\Contracts\Actors\ActorAttention;
use App\Contracts\Asks\AskReader;
use App\Contracts\Bus\CommandBus;
use App\Support\ProfileProposal;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestIds;
use Tests\TestCase;

final class AskSupervisorTest extends TestCase
{
    use CommitsHookRows;

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

    public function test_a_user_supervisor_has_a_card_without_a_runtime_wake(): void
    {
        $this->journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')));
        $owner = $this->journal->ownerUser();
        $this->mock(ActorAttention::class)->shouldNotReceive('request');
        $requester = $this->journal->idleAgent('Requester', 'journal-main')->agentCalled('Requester');
        $this->journal->actAsAgentIds($requester->id, TestIds::of(99));

        $ask = $this->app->make(CommandBus::class)->run(new AskSupervisorCommand('Check my result.', 'owner-question'));
        $this->journal->actAs('Owner');
        $card = $this->app->make(AskReader::class)->card($ask);

        $this->assertTrue($card->isObligation);
        $this->assertSame($owner->id, $card->holderId);
    }
}
