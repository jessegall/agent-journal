<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\InstallMainAgent\InstallMainAgentCommand;
use App\Exceptions\MainAgentMissing;
use App\Models\Agents\Agent;
use App\Models\Agents\MainAgentDesignation;
use App\Values\ProfileBase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * An installation has one designated main agent, created by agents:install once; Home and admission read it only
 * through the designation.
 */
#[TestsCommand(InstallMainAgentCommand::class)]
final class InstallMainAgentTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'main_agent_designations',
        'agents',
        'inboxes', 'inbox_members',
        'command_receipts',
        'links',
    ];

    public function test_an_installation_without_a_designation_has_no_main_agent(): void
    {
        $this->expectException(MainAgentMissing::class);

        MainAgentDesignation::resolveDesignatedAgent();
    }

    public function test_the_install_designates_one_main_agent_and_a_second_run_changes_nothing(): void
    {
        $this->journal->installInboxes();
        $this->localProject();

        $this->artisan('agents:install')->assertSuccessful();
        $main = MainAgentDesignation::resolveDesignatedAgent();
        $this->artisan('agents:install')->assertSuccessful();

        $this->assertSame(ProfileBase::mainAgent()->key, $main->profile_key);
        $this->assertSame($main->id, MainAgentDesignation::resolveDesignatedAgent()->id);
        $this->assertSame(1, Agent::query()->withoutGlobalScopes()->count());
        $this->assertSame(1, MainAgentDesignation::query()->count());
    }
}
