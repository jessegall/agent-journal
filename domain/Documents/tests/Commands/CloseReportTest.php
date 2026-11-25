<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\SignedCall;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;

/**
 * An agent closes only the reports it created.
 */
final class CloseReportTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'record_settlements',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser(1);

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
    }

    public function test_an_agent_settles_only_the_reports_it_created(): void
    {
        $this->actAsAgent(9, 90);
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        $this->bus()->run(new CloseReportCommand('1', 'Checked.'));
        $this->assertSame(AttentionStatus::Settled, Report::query()->sole()->attention);

        $this->actAsUser(1);
        $this->bus()->run(new CreateReportCommand('Other', 'By a user', "Text\n"));
        $this->actAsAgent(8, 80);
        $this->expectException(ActorNotAllowed::class);

        $this->bus()->run(new CloseReportCommand('2', 'Not mine.'));
    }

    private function actAsAgent(int $agent, int $session): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of($agent)),
            TestStartAuthority::forAgent(TestIds::of($agent)),
        );

        $call = new SignedCall(TestIds::of(500 + $agent), CarbonImmutable::now(), str_repeat('0', 64));
        $context = new AgentContext(TestIds::of($agent), TestIds::of($session), $call, null);
        $this->app->instance(AgentContext::class, $context);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
